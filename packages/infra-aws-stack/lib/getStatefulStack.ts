import { Stack } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import {
    DatabaseCluster,
    DatabaseInstance,
    ServerlessCluster,
} from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';

interface Config {
    name: string;
    env: {
        account?: string;
        region?: string;
    };
    createVpc: (params: Promise<{ scope: Construct }>) => Promise<Vpc>;
    createRds: (
        params: Promise<{ scope: Construct; vpc: Vpc }>
    ) => Promise<DatabaseCluster | DatabaseInstance | ServerlessCluster>;
}

interface Params {
    scope: Construct;
}

export default ({ name, env, createVpc, createRds }: Config) =>
    (handler: Promise<Params>) =>
        handler
            // Stackの作成
            .then(({ scope }) => {
                const stack = new Stack(scope, name, { env });
                return { stack };
            })
            // VPCの作成
            .then(async ({ stack }) => {
                const vpc = await createVpc(Promise.resolve({ scope: stack }));
                return { stack, vpc };
            })
            // RDSの作成
            .then(async ({ stack, vpc }) => {
                const db = await createRds(
                    Promise.resolve({ scope: stack, vpc })
                );
                return { vpc, db };
            });
