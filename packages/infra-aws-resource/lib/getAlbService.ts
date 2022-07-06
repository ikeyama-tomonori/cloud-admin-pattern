import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { ContainerImage, Secret } from 'aws-cdk-lib/aws-ecs';
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
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
    vpc: Vpc;
    db: DatabaseCluster | DatabaseInstance | ServerlessCluster;
}

export default ({ name, assetPath }: Config) =>
    (params: Params) =>
        Promise.resolve(params)
            // Serviceの追加
            .then(({ scope, vpc, db }) => {
                const { secret } = db;
                if (!secret) throw new Error('secret is null');

                const alb = new ApplicationLoadBalancedFargateService(
                    scope,
                    name,
                    {
                        vpc,
                        assignPublicIp: true,
                        desiredCount: 1,
                        taskImageOptions: {
                            image: ContainerImage.fromAsset(assetPath),
                            environment: {
                                Logging__Console__DisableColors: 'true',
                                'Logging__LogLevel__Microsoft.AspNetCore.HttpLogging.HttpLoggingMiddleware':
                                    'Information',
                            },
                            secrets: {
                                DbSecret: Secret.fromSecretsManager(secret),
                            },
                        },
                    }
                );

                return { db, alb };
            })
            // 設定
            .then(({ db, alb }) => {
                // データベースへの接続許可
                alb.service.connections.allowToDefaultPort(db.connections);
                // スケールしないようにする
                alb.service.autoScaleTaskCount({ maxCapacity: 1 });

                return alb;
            });
