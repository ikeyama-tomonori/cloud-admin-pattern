import {
    AwsLogDriver,
    ContainerImage,
    FargateTaskDefinition,
    Secret,
} from 'aws-cdk-lib/aws-ecs';
import {
    DatabaseCluster,
    DatabaseInstance,
    ServerlessCluster,
} from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';

interface Config {
    name: string;
    assetPath: string;
}

interface Params {
    scope: Construct;
    db: DatabaseCluster | DatabaseInstance | ServerlessCluster;
}

export default ({ name, assetPath }: Config) =>
    (handler: Promise<Params>) =>
        handler
            // タスク定義の作成
            .then(({ scope, ...rest }) => {
                const task = new FargateTaskDefinition(scope, `${name}TaskDef`);
                return { task, ...rest };
            })
            // コンテナの設定
            .then(({ task, db }) => {
                const { secret } = db;
                if (!secret) throw new Error('secret is null');

                task.addContainer(`${name}Container`, {
                    image: ContainerImage.fromAsset(assetPath),
                    environment: {
                        Logging__Console__DisableColors: 'true',
                    },
                    secrets: {
                        DbSecret: Secret.fromSecretsManager(secret),
                    },
                    logging: new AwsLogDriver({ streamPrefix: task.node.id }),
                });

                return task;
            });
