import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { ContainerImage, Secret } from 'aws-cdk-lib/aws-ecs';
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
import { ApplicationProtocol } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import {
    DatabaseCluster,
    DatabaseInstance,
    ServerlessCluster,
} from 'aws-cdk-lib/aws-rds';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';

interface Config {
    name: string;
    assetPath: string;
    domainName: string;
}

interface Params {
    scope: Construct;
    vpc: Vpc;
    db: DatabaseCluster | DatabaseInstance | ServerlessCluster;
    hostedZone: HostedZone;
}

export default ({ name, assetPath, domainName }: Config) =>
    (params: Params) =>
        Promise.resolve(params)
            // Serviceの追加
            .then(({ scope, vpc, db, hostedZone }) => {
                const { secret } = db;
                if (!secret) throw new Error('secret is null');

                const alb = new ApplicationLoadBalancedFargateService(
                    scope,
                    name,
                    {
                        assignPublicIp: true,
                        desiredCount: 1,
                        domainName,
                        domainZone: hostedZone,
                        protocol: ApplicationProtocol.HTTPS,
                        redirectHTTP: true,
                        taskImageOptions: {
                            environment: {
                                Logging__Console__DisableColors: 'true',
                                'Logging__LogLevel__Microsoft.AspNetCore.HttpLogging.HttpLoggingMiddleware':
                                    'Information',
                            },
                            image: ContainerImage.fromAsset(assetPath),
                            secrets: {
                                DbSecret: Secret.fromSecretsManager(secret),
                            },
                        },
                        vpc,
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
