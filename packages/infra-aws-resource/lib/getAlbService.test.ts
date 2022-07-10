import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { DatabaseInstance, DatabaseInstanceEngine } from 'aws-cdk-lib/aws-rds';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import getAlbService from './getAlbService';

describe('getAlbService', () => {
    it('ALB Serviceが作成できる', async () => {
        const app = new App();
        const stack = new Stack(app, 'test', {
            env: { account: '000000000000', region: 'ap-northeast-1' },
        });
        const vpc = new Vpc(stack, 'Vpc');
        const db = new DatabaseInstance(stack, 'Rds', {
            engine: DatabaseInstanceEngine.MYSQL,
            vpc,
        });
        const hostedZone = new HostedZone(stack, 'TestHostedZone', {
            zoneName: 'test.example.com',
        });
        const createAlb = getAlbService({
            name: 'TestAlbService',
            assetPath: './dist/webapp',
            domainName: 'test.example.com',
        });
        await createAlb({ scope: stack, vpc, db, hostedZone });

        const template = Template.fromStack(stack);

        template.hasResourceProperties('AWS::CertificateManager::Certificate', {
            DomainName: 'test.example.com',
            ValidationMethod: 'DNS',
        });

        template.hasResourceProperties(
            'AWS::ElasticLoadBalancingV2::LoadBalancer',
            {
                Type: 'application',
            }
        );

        template.hasResourceProperties('AWS::ECS::TaskDefinition', {
            Cpu: '256',
            Memory: '512',
            NetworkMode: 'awsvpc',
            RequiresCompatibilities: ['FARGATE'],
        });
    });
});
