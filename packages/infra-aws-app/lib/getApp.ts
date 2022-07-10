import { App, aws_rds as rds } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { ApplicationLoadBalancer } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';

interface Config {
    hostedZoneStack: (params: {
        scope: Construct;
    }) => Promise<{ hostedZone: HostedZone }>;
    statefulStack: (params: {
        scope: Construct;
        hostedZone: HostedZone;
    }) => Promise<{
        vpc: Vpc;
        db: rds.DatabaseCluster | rds.DatabaseInstance | rds.ServerlessCluster;
    }>;
    statelessStack: (params: {
        scope: Construct;
        vpc: Vpc;
        db: rds.DatabaseCluster | rds.DatabaseInstance | rds.ServerlessCluster;
        hostedZone: HostedZone;
    }) => Promise<{
        loadBalancer: ApplicationLoadBalancer;
    }>;
    hostNameStack: (params: {
        scope: Construct;
        hostedZone: HostedZone;
        loadBalancer: ApplicationLoadBalancer;
    }) => Promise<unknown>;
}

export default ({
        hostedZoneStack,
        statefulStack,
        statelessStack,
        hostNameStack,
    }: Config) =>
    () =>
        Promise.resolve()
            // Appの作成
            .then(() => ({
                app: new App(),
            }))
            // DNSスタックの作成
            .then(async ({ app }) => {
                const { hostedZone } = await hostedZoneStack({ scope: app });
                return { app, hostedZone };
            })
            // ステートフルスタックの作成
            .then(async ({ app, hostedZone }) => {
                const { vpc, db } = await statefulStack({
                    scope: app,
                    hostedZone,
                });
                return { app, vpc, db, hostedZone };
            })
            // ステートレススタックの作成
            .then(async ({ app, vpc, db, hostedZone }) => {
                const { loadBalancer } = await statelessStack({
                    scope: app,
                    vpc,
                    db,
                    hostedZone,
                });
                return { app, loadBalancer, hostedZone };
            })
            // ホスト名スタックの作成
            .then(async ({ app, loadBalancer, hostedZone }) => {
                await hostNameStack({
                    scope: app,
                    loadBalancer,
                    hostedZone,
                });
            });
