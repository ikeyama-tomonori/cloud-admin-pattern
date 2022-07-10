import { Stack } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { ICluster, TaskDefinition } from 'aws-cdk-lib/aws-ecs';
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
import {
    DatabaseCluster,
    DatabaseInstance,
    ServerlessCluster,
} from 'aws-cdk-lib/aws-rds';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { ApplicationListener } from 'aws-cdk-lib/aws-elasticloadbalancingv2';

interface Config {
    name: string;
    env: {
        account?: string;
        region?: string;
    };
    createAlbService: (params: {
        scope: Construct;
        vpc: Vpc;
        db: DatabaseCluster | DatabaseInstance | ServerlessCluster;
        hostedZone: HostedZone;
    }) => Promise<ApplicationLoadBalancedFargateService>;
    createCertificate: (params: {
        scope: Construct;
        hostedZone: HostedZone;
    }) => Promise<{ certificate: Certificate }>;
    addCertificate: (params: {
        listener: ApplicationListener;
        certificate: Certificate;
    }) => Promise<void>;
    createRdbMigrationTask: (params: {
        scope: Construct;
        db: DatabaseCluster | DatabaseInstance | ServerlessCluster;
    }) => Promise<TaskDefinition>;
    createRunTaskOnce: (params: {
        scope: Construct;
        task: TaskDefinition;
        cluster: ICluster;
        db: DatabaseCluster | DatabaseInstance | ServerlessCluster;
    }) => Promise<unknown>;
}

interface Params {
    scope: Construct;
    vpc: Vpc;
    db: DatabaseCluster | DatabaseInstance | ServerlessCluster;
    hostedZone: HostedZone;
}

export default ({
        name,
        env,
        createAlbService,
        createCertificate,
        addCertificate,
        createRdbMigrationTask,
        createRunTaskOnce,
    }: Config) =>
    (params: Params) =>
        Promise.resolve(params)
            // Stackの作成
            .then(({ scope, ...rest }) => {
                const stack = new Stack(scope, name, { env });
                return { stack, ...rest };
            })
            // ALB Serviceの作成
            .then(async ({ stack, vpc, db, hostedZone }) => {
                const { cluster, listener, loadBalancer } =
                    await createAlbService({
                        scope: stack,
                        vpc,
                        db,
                        hostedZone,
                    });

                return {
                    stack,
                    db,
                    cluster,
                    listener,
                    loadBalancer,
                    hostedZone,
                };
            })
            // 証明書の作成
            .then(async ({ stack, hostedZone, ...rest }) => {
                const { certificate } = await createCertificate({
                    scope: stack,
                    hostedZone,
                });
                return { stack, certificate, hostedZone, ...rest };
            })
            // Listenerに証明書を追加
            .then(async ({ stack, certificate, listener, ...rest }) => {
                await addCertificate({ listener, certificate });
                return { stack, ...rest };
            })
            // Migration用Task定義の作成
            .then(async ({ stack, db, ...rest }) => {
                const task = await createRdbMigrationTask({ scope: stack, db });
                return { stack, task, db, ...rest };
            })
            .then(async ({ stack, cluster, task, db, loadBalancer }) => {
                await createRunTaskOnce({
                    scope: stack,
                    cluster,
                    task,
                    db,
                });
                return { loadBalancer };
            });
