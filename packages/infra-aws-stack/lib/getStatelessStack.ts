import { Stack } from "aws-cdk-lib";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import {
	UserPool,
	UserPoolClient,
	UserPoolDomain,
} from "aws-cdk-lib/aws-cognito";
import { Vpc } from "aws-cdk-lib/aws-ec2";
import { ICluster, TaskDefinition } from "aws-cdk-lib/aws-ecs";
import {
	ApplicationListener,
	ApplicationLoadBalancer,
} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import {
	DatabaseCluster,
	DatabaseInstance,
	ServerlessCluster,
} from "aws-cdk-lib/aws-rds";
import { HostedZone } from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";

interface Config {
	name: string;
	env: {
		account?: string;
		region?: string;
	};
	createCertificate: (params: {
		scope: Construct;
		hostedZone: HostedZone;
	}) => Promise<{ certificate: Certificate }>;
	createAlbService: (params: {
		scope: Construct;
		vpc: Vpc;
		db: DatabaseCluster | DatabaseInstance | ServerlessCluster;
		hostedZone: HostedZone;
		certificate: Certificate;
		cognito: {
			userPool: UserPool;
			userPoolClient: UserPoolClient;
			userPoolDomain: UserPoolDomain;
		};
	}) => Promise<{
		cluster: ICluster;
		listener: ApplicationListener;
		loadBalancer: ApplicationLoadBalancer;
	}>;
	createRdbMigrationTask: (params: {
		scope: Construct;
		db: DatabaseCluster | DatabaseInstance | ServerlessCluster;
	}) => Promise<{ taskDefinition: TaskDefinition }>;
	createRunTaskOnce: (params: {
		scope: Construct;
		taskDefinition: TaskDefinition;
		cluster: ICluster;
		db: DatabaseCluster | DatabaseInstance | ServerlessCluster;
	}) => Promise<void>;
}

interface Params {
	scope: Construct;
	vpc: Vpc;
	db: DatabaseCluster | DatabaseInstance | ServerlessCluster;
	hostedZone: HostedZone;
	cognito: {
		userPool: UserPool;
		userPoolClient: UserPoolClient;
		userPoolDomain: UserPoolDomain;
	};
}

export default ({
		name,
		env,
		createCertificate,
		createAlbService,
		createRdbMigrationTask,
		createRunTaskOnce,
	}: Config) =>
	(params: Params) =>
		Promise.resolve(params)
			// Stackの作成
			.then(({ scope, ...rest }) => {
				const stack = new Stack(scope, name, { env });
				return { stack, ...rest };
			})
			// 証明書の作成
			.then(async ({ stack, hostedZone, ...rest }) => {
				const { certificate } = await createCertificate({
					scope: stack,
					hostedZone,
				});
				return { stack, certificate, hostedZone, ...rest };
			})
			// ALB Serviceの作成
			.then(async ({ stack, vpc, db, hostedZone, certificate, cognito }) => {
				const { cluster, listener, loadBalancer } = await createAlbService({
					scope: stack,
					vpc,
					db,
					hostedZone,
					certificate,
					cognito,
				});

				return {
					stack,
					db,
					cluster,
					listener,
					loadBalancer,
					hostedZone,
				};
			})
			// Migration用Task定義の作成
			.then(async ({ stack, db, ...rest }) => {
				const { taskDefinition } = await createRdbMigrationTask({
					scope: stack,
					db,
				});
				return { stack, taskDefinition, db, ...rest };
			})
			.then(async ({ stack, cluster, taskDefinition, db, loadBalancer }) => {
				await createRunTaskOnce({
					scope: stack,
					cluster,
					taskDefinition,
					db,
				});
				return { stack, loadBalancer };
			});
