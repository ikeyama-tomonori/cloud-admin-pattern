import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import getVpc from './getVpc';

describe('getVpc', () => {
    it('東京リージョンで作成されるサブネットの数は9', async () => {
        const app = new App();
        const stack = new Stack(app, 'test', {
            env: { account: '000000000000', region: 'ap-northeast-1' },
        });
        const createVpc = getVpc({ name: 'TestVpc' });
        await createVpc(Promise.resolve({ scope: stack }));

        Template.fromStack(stack).resourceCountIs('AWS::EC2::Subnet', 9);
    });
});
