import { Stack } from 'aws-cdk-lib';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';

interface Config {
    name: string;
    env: {
        account?: string;
        region?: string;
    };
    createRoute53: (params: { scope: Construct }) => Promise<HostedZone>;
}

interface Params {
    scope: Construct;
}

export default ({ name, env, createRoute53 }: Config) =>
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
                return { hostedZone };
            });
