import { ApplicationLoadBalancer } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { ARecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { LoadBalancerTarget } from 'aws-cdk-lib/aws-route53-targets';
import { Construct } from 'constructs';

interface Config {
    name: string;
}

interface Params {
    scope: Construct;
    hostedZone: HostedZone;
    loadBalancer: ApplicationLoadBalancer;
}

export default ({ name }: Config) =>
    (params: Params) =>
        Promise.resolve(params)
            // Targetの作成
            .then(({ scope, hostedZone, loadBalancer }) => ({
                scope,
                hostedZone,
                loadBalancerTarget: new LoadBalancerTarget(loadBalancer),
            }))
            // A Recordを作成
            .then(({ scope, hostedZone, loadBalancerTarget }) => ({
                aRecord: new ARecord(scope, name, {
                    zone: hostedZone,
                    target: RecordTarget.fromAlias(loadBalancerTarget),
                }),
            }));
