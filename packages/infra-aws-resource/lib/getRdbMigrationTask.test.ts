import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { DatabaseInstance, DatabaseInstanceEngine } from 'aws-cdk-lib/aws-rds';
import getRdbMigrationTask from './getRdbMigrationTask';

describe('getRdbMigrationTask', () => {
    it('タスク定義が作成できる', async () => {
        const app = new App();
        const stack = new Stack(app, 'test', {
            env: { account: '000000000000', region: 'ap-northeast-1' },
        });
        const vpc = new Vpc(stack, 'Vpc');
        const db = new DatabaseInstance(stack, 'Rds', {
            engine: DatabaseInstanceEngine.MYSQL,
            vpc,
        });

        const createRdbMigrationTask = getRdbMigrationTask({
            name: 'TestMigration',
            assetPath: './dist/migration',
        });
        await createRdbMigrationTask({ scope: stack, db });

        const template = Template.fromStack(stack);
        template.hasResourceProperties('AWS::ECS::TaskDefinition', {
            RequiresCompatibilities: ['FARGATE'],
        });
    });
});
