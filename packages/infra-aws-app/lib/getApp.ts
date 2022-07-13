import { App, aws_rds as rds } from 'aws-cdk-lib';
import {
    UserPool,
    UserPoolClient,
    UserPoolDomain,
} from 'aws-cdk-lib/aws-cognito';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { ApplicationLoadBalancer } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';

interface Config {
    statefulStack: (params: { scope: Construct }) => Promise<{
        vpc: Vpc;
        db: rds.DatabaseCluster | rds.DatabaseInstance | rds.ServerlessCluster;
        hostedZone: HostedZone;
        cognito: {
            userPool: UserPool;
            userPoolClient: UserPoolClient;
            userPoolDomain: UserPoolDomain;
        };
    }>;
    statelessStack: (params: {
        scope: Construct;
        vpc: Vpc;
        db: rds.DatabaseCluster | rds.DatabaseInstance | rds.ServerlessCluster;
        hostedZone: HostedZone;
        cognito: {
            userPool: UserPool;
            userPoolClient: UserPoolClient;
            userPoolDomain: UserPoolDomain;
        };
    }) => Promise<{
        loadBalancer: ApplicationLoadBalancer;
    }>;
    hostNameStack: (params: {
        scope: Construct;
        hostedZone: HostedZone;
        loadBalancer: ApplicationLoadBalancer;
    }) => Promise<unknown>;
}

export default ({ statefulStack, statelessStack, hostNameStack }: Config) =>
    () =>
        Promise.resolve()
            // Appの作成
            .then(() => ({
                app: new App(),
            }))
            // ステートフルスタックの作成
            .then(async ({ app }) => {
                const { vpc, db, hostedZone, cognito } = await statefulStack({
                    scope: app,
                });
                return { app, vpc, db, hostedZone, cognito };
            })
            // ステートレススタックの作成
            .then(async ({ app, vpc, db, hostedZone, cognito }) => {
                const { loadBalancer } = await statelessStack({
                    scope: app,
                    vpc,
                    db,
                    hostedZone,
                    cognito,
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
