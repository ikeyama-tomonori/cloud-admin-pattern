import { Stack } from 'aws-cdk-lib';
import {
    DatabaseCluster,
    DatabaseInstance,
    ServerlessCluster,
} from 'aws-cdk-lib/aws-rds';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
import { TaskDefinition, ICluster } from 'aws-cdk-lib/aws-ecs';
import { Construct } from 'constructs';

interface Config {
    name: string;
    env: {
        account?: string;
        region?: string;
    };
    createAlbService: (
        params: Promise<{
            scope: Construct;
            vpc: Vpc;
            db: DatabaseCluster | DatabaseInstance | ServerlessCluster;
        }>
    ) => Promise<ApplicationLoadBalancedFargateService>;
    createRdbMigrationTask: (
        params: Promise<{
            scope: Construct;
            db: DatabaseCluster | DatabaseInstance | ServerlessCluster;
        }>
    ) => Promise<TaskDefinition>;
    createRunTaskOnce: (
        params: Promise<{
            scope: Construct;
            task: TaskDefinition;
            cluster: ICluster;
            db: DatabaseCluster | DatabaseInstance | ServerlessCluster;
        }>
    ) => Promise<unknown>;
}

interface Params {
    scope: Construct;
    vpc: Vpc;
    db: DatabaseCluster | DatabaseInstance | ServerlessCluster;
}

export default ({
        name,
        env,
        createAlbService,
        createRdbMigrationTask,
        createRunTaskOnce,
    }: Config) =>
    (handler: Promise<Params>) =>
        handler
            // Stackの作成
            .then(({ scope, ...rest }) => {
                const stack = new Stack(scope, name, { env });
                return { stack, ...rest };
            })
            // ALB Serviceの作成
            .then(async ({ stack, vpc, db }) => {
                const albService = await createAlbService(
                    Promise.resolve({ scope: stack, vpc, db })
                );
                const { cluster } = albService;
                return { stack, db, cluster };
            })
            // Migration用Task定義の作成
            .then(async ({ stack, db, cluster }) => {
                const task = await createRdbMigrationTask(
                    Promise.resolve({ scope: stack, db })
                );
                return { stack, cluster, task, db };
            })
            .then(async ({ stack, cluster, task, db }) => {
                const runTask = await createRunTaskOnce(
                    Promise.resolve({ scope: stack, cluster, task, db })
                );
                return { runTask };
            });
