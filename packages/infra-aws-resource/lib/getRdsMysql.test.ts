import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import getRdsMysql from './getRdsMysql';

describe('getRdsMysql', () => {
    it('RDS(MySQL)が作成できる', async () => {
        const app = new App();
        const stack = new Stack(app, 'test', {
            env: { account: '000000000000', region: 'ap-northeast-1' },
        });
        const vpc = new Vpc(stack, 'Vpc', {
            subnetConfiguration: [
                {
                    subnetType: SubnetType.PUBLIC,
                    name: 'Ingress',
                    cidrMask: 24,
                },
                {
                    cidrMask: 24,
                    name: 'Application',
                    subnetType: SubnetType.PRIVATE_WITH_NAT,
                },
                {
                    cidrMask: 28,
                    name: 'Database',
                    subnetType: SubnetType.PRIVATE_ISOLATED,
                },
            ],
        });
        const createRds = getRdsMysql({ name: 'TestDatabase' });
        await createRds({ scope: stack, vpc });

        const template = Template.fromStack(stack);
        template.hasResourceProperties('AWS::RDS::DBInstance', {
            Engine: 'mysql',
            PubliclyAccessible: true,
        });
    });
});
