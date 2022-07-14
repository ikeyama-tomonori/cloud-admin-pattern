import { Stack } from 'aws-cdk-lib';
import { ARecord, HostedZone } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';
import { ApplicationLoadBalancer } from 'aws-cdk-lib/aws-elasticloadbalancingv2';

interface Config {
    name: string;
    env: {
        account?: string;
        region?: string;
    };
    createARecord: (params: {
        scope: Construct;
        hostedZone: HostedZone;
        loadBalancer: ApplicationLoadBalancer;
    }) => Promise<{ aRecord: ARecord }>;
}

interface Params {
    scope: Construct;
    hostedZone: HostedZone;
    loadBalancer: ApplicationLoadBalancer;
}

export default ({
        name,
        env,

        createARecord,
    }: Config) =>
    (params: Params) =>
        Promise.resolve(params)
            // Stackの作成
            .then(({ scope, ...rest }) => {
                const stack = new Stack(scope, name, { env });
                return { stack, ...rest };
            })

            // Route53 HostedZoneの作成
            .then(async ({ stack, hostedZone, loadBalancer }) => {
                const { aRecord } = await createARecord({
                    scope: stack,
                    hostedZone,
                    loadBalancer,
                });

                return { stack, aRecord };
            });
