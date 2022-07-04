import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { DatabaseInstance, DatabaseInstanceEngine } from 'aws-cdk-lib/aws-rds';
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

        const createAlb = getAlbService({
            name: 'TestAlbService',
            assetPath: './dist/webapp',
        });
        await createAlb({ scope: stack, vpc, db });

        const template = Template.fromStack(stack);

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
