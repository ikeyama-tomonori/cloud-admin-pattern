import { Stack } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import {
    DatabaseCluster,
    DatabaseInstance,
    ServerlessCluster,
} from 'aws-cdk-lib/aws-rds';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';

interface Config {
    name: string;
    env: {
        account?: string;
        region?: string;
    };
    createVpc: (params: { scope: Construct }) => Promise<{ vpc: Vpc }>;
    createRds: (params: { scope: Construct; vpc: Vpc }) => Promise<{
        db: DatabaseCluster | DatabaseInstance | ServerlessCluster;
    }>;
}

interface Params {
    scope: Construct;
    hostedZone: HostedZone;
}

export default ({ name, env, createVpc, createRds }: Config) =>
    (params: Params) =>
        Promise.resolve(params)
            // Stackの作成
            .then(({ scope, hostedZone }) => {
                const stack = new Stack(scope, name, { env });
                return { stack, hostedZone };
            })
            // VPCの作成
            .then(async ({ stack }) => {
                const { vpc } = await createVpc({ scope: stack });
                return { stack, vpc };
            })
            // RDSの作成
            .then(async ({ stack, vpc }) => {
                const { db } = await createRds({ scope: stack, vpc });
                return { vpc, db };
            });
