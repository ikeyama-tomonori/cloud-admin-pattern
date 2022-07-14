import { App } from 'aws-cdk-lib';
import { ApplicationLoadBalancer } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import { getHostNameStack } from '.';

describe('getHostNameStack', async () => {
    it('実行できる', async () => {
        const app = new App();

        const aRecord = {};

        const createARecord = vi
            .fn()
            .mockReturnValueOnce(Promise.resolve({ aRecord }));

        const hostNameStack = getHostNameStack({
            name: 'testStack',
            env: {},
            createARecord,
        });

        const result = await hostNameStack({
            scope: app,
            loadBalancer: {} as ApplicationLoadBalancer,
            hostedZone: {} as HostedZone,
        });

        expect(createARecord).toHaveBeenCalled();

        expect(result.aRecord).toBe(aRecord);
    });
});
