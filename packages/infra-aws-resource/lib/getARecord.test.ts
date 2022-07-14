import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { ApplicationLoadBalancer } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import { getARecord } from '.';

describe('getARecord', () => {
    it('A Recordが作成できる', async () => {
        const app = new App();
        const stack = new Stack(app, 'test', {
            env: { account: '000000000000', region: 'ap-northeast-1' },
        });
        const hostedZone = new HostedZone(stack, 'TestHostedZone', {
            zoneName: 'test.example.com',
        });
        const vpc = new Vpc(stack, 'Vpc');
        const loadBalancer = new ApplicationLoadBalancer(
            stack,
            'testLoadBlancer',
            { vpc }
        );

        const createARecord = getARecord({
            name: 'TestRecord',
        });
        await createARecord({ scope: stack, hostedZone, loadBalancer });

        const template = Template.fromStack(stack);

        template.hasResourceProperties('AWS::Route53::RecordSet', {
            Name: 'test.example.com.',
            Type: 'A',
        });
    });
});
