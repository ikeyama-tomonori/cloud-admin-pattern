import { App, aws_ec2 as ec2, aws_rds as rds } from 'aws-cdk-lib';
import { Construct } from 'constructs';

interface Config {
    statefulStack: (params: Promise<{ scope: Construct }>) => Promise<{
        vpc: ec2.Vpc;
        db: rds.DatabaseCluster | rds.DatabaseInstance | rds.ServerlessCluster;
    }>;
    statelessStack: (
        params: Promise<{
            scope: Construct;
            vpc: ec2.Vpc;
            db:
                | rds.DatabaseCluster
                | rds.DatabaseInstance
                | rds.ServerlessCluster;
        }>
    ) => Promise<unknown>;
}

export default ({ statefulStack, statelessStack }: Config) =>
    (handler: Promise<unknown>) =>
        handler
            // Appの作成
            .then(() => ({
                app: new App(),
            }))
            // ステートフルスタックの作成
            .then(async ({ app }) => {
                const { vpc, db } = await statefulStack(
                    Promise.resolve({ scope: app })
                );
                return { app, vpc, db };
            })
            // ステートレススタックの作成
            .then(async ({ app, vpc, db }) => {
                await statelessStack(Promise.resolve({ scope: app, vpc, db }));
            });
