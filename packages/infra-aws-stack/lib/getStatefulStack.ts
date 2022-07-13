import { Stack } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import {
    DatabaseCluster,
    DatabaseInstance,
    ServerlessCluster,
} from 'aws-cdk-lib/aws-rds';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';
import {
    UserPool,
    UserPoolClient,
    UserPoolDomain,
} from 'aws-cdk-lib/aws-cognito';

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
    createRoute53: (params: { scope: Construct }) => Promise<HostedZone>;
    createCognito: (params: { scope: Construct }) => Promise<{
        userPool: UserPool;
        userPoolClient: UserPoolClient;
        userPoolDomain: UserPoolDomain;
    }>;
}

interface Params {
    scope: Construct;
}

export default ({
        name,
        env,
        createRoute53,
        createVpc,
        createRds,
        createCognito,
    }: Config) =>
    (params: Params) =>
        Promise.resolve(params)
            // Stackの作成
            .then(({ scope }) => {
                const stack = new Stack(scope, name, { env });
                return { stack };
            })
            // Route53 HostedZoneの作成
            .then(async ({ stack }) => {
                const hostedZone = await createRoute53({ scope: stack });
                return { stack, hostedZone };
            })
            // VPCの作成
            .then(async ({ stack, ...rest }) => {
                const { vpc } = await createVpc({ scope: stack });
                return { stack, vpc, ...rest };
            })
            // RDSの作成
            .then(async ({ stack, vpc, ...rest }) => {
                const { db } = await createRds({ scope: stack, vpc });
                return { stack, vpc, db, ...rest };
            })
            // Cognitoの作成
            .then(async ({ stack, ...rest }) => {
                const cognito = await createCognito({ scope: stack });
                return {
                    stack,
                    ...rest,
                    cognito,
                };
            });
