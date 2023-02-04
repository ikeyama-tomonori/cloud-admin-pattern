import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import {
	UserPool,
	UserPoolClient,
	UserPoolDomain,
} from "aws-cdk-lib/aws-cognito";
import { Port, Protocol, Vpc } from "aws-cdk-lib/aws-ec2";
import { ContainerImage, Secret } from "aws-cdk-lib/aws-ecs";
import { ApplicationLoadBalancedFargateService } from "aws-cdk-lib/aws-ecs-patterns";
import {
	ApplicationProtocol,
	ListenerAction,
} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import { AuthenticateCognitoAction } from "aws-cdk-lib/aws-elasticloadbalancingv2-actions";
import {
	DatabaseCluster,
	DatabaseInstance,
	ServerlessCluster,
} from "aws-cdk-lib/aws-rds";
import { HostedZone } from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";

interface Config {
	name: string;
	assetPath: string;
	domainName: string;
}

interface Params {
	scope: Construct;
	vpc: Vpc;
	db: DatabaseCluster | DatabaseInstance | ServerlessCluster;
	certificate: Certificate;
	hostedZone: HostedZone;
	cognito: {
		userPool: UserPool;
		userPoolClient: UserPoolClient;
		userPoolDomain: UserPoolDomain;
	};
}

export default ({ name, assetPath, domainName }: Config) =>
	(params: Params) =>
		Promise.resolve(params)
			// Serviceの追加
			.then(({ scope, vpc, db, certificate, hostedZone, cognito }) => {
				const { secret } = db;
				if (!secret) throw new Error("secret is null");

				const alb = new ApplicationLoadBalancedFargateService(scope, name, {
					assignPublicIp: true,
					certificate,
					desiredCount: 1,
					domainName,
					domainZone: hostedZone,
					protocol: ApplicationProtocol.HTTPS,
					redirectHTTP: true,
					taskImageOptions: {
						environment: {
							Logging__Console__DisableColors: "true",
							"Logging__LogLevel__Microsoft.AspNetCore.HttpLogging.HttpLoggingMiddleware":
								"Information",
						},
						image: ContainerImage.fromAsset(assetPath),
						secrets: {
							DbSecret: Secret.fromSecretsManager(secret),
						},
					},
					vpc,
				});

				return { db, alb, cognito };
			})
			// 設定
			.then(({ db, alb, cognito }) => {
				// データベースへの接続許可
				alb.service.connections.allowToDefaultPort(db.connections);
				// スケールしないようにする
				alb.service.autoScaleTaskCount({ maxCapacity: 1 });

				return { alb, cognito };
			})
			// LoadBalancerがCognitoにアクセスできるようにする
			.then(({ alb, cognito }) => {
				alb.loadBalancer.connections.allowToAnyIpv4(
					new Port({
						fromPort: 443,
						protocol: Protocol.TCP,
						stringRepresentation: "443",
						toPort: 443,
					}),
				);

				return { alb, cognito };
			})
			// Cognitoとの連携
			.then(
				({ alb, cognito: { userPool, userPoolClient, userPoolDomain } }) => {
					// Actionの追加
					const action = new AuthenticateCognitoAction({
						userPool,
						userPoolClient,
						userPoolDomain,
						next: ListenerAction.forward([alb.targetGroup]),
					});
					alb.listener.addAction("CognitoAuthentication", { action });

					return alb;
				},
			);
