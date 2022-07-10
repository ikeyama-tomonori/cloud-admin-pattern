import { App, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { ApplicationLoadBalancer } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import getCertificateAdd from './getCertificateAdd';

describe('getCertificateAdd', () => {
    it('ListenerにCertificateを追加できる', async () => {
        const app = new App();
        const stack = new Stack(app, 'test', {
            env: { account: '000000000000', region: 'ap-northeast-1' },
        });
        const vpc = new Vpc(stack, 'Vpc');
        const listener = new ApplicationLoadBalancer(stack, 'TestAlb', {
            vpc,
        }).addListener('TestListener', { port: 80 });
        const certificate = new Certificate(stack, 'TestCertificate', {
            domainName: 'test.example.com',
        });
        listener.addTargets('TestTargets', {});

        const addListener = getCertificateAdd({
            name: 'TestListenerCertificate',
        });

        await addListener({ listener, certificate });

        const template = Template.fromStack(stack);

        console.log(template.toJSON());

        template.hasResourceProperties(
            'AWS::ElasticLoadBalancingV2::Listener',
            {
                Certificates: [{ CertificateArn: { Ref: Match.anyValue() } }],
            }
        );
    });
});
