import {
	UserPool,
	UserPoolClient,
	CfnUserPoolClient,
	UserPoolDomain,
	OAuthScope,
} from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

interface Config {
	name: string;
	domainName: string;
	versionDomainName: string;
	userPoolDomainPrefix: string;
}

interface Params {
	scope: Construct;
}

export default ({
		name,
		domainName,
		versionDomainName,
		userPoolDomainPrefix,
	}: Config) =>
	(params: Params) =>
		Promise.resolve(params)
			// UserPoolの作成
			.then(({ scope }) => ({
				scope,
				userPool: new UserPool(scope, name),
			}))
			// UserPoolClientの作成
			.then(({ scope, userPool }) => ({
				scope,
				userPool,
				userPoolClient: new UserPoolClient(scope, `${name}Client`, {
					userPool,

					// Required minimal configuration for use with an ELB
					generateSecret: true,
					authFlows: {
						userPassword: true,
					},
					oAuth: {
						flows: {
							authorizationCodeGrant: true,
						},
						scopes: [OAuthScope.EMAIL],
						callbackUrls: [
							`https://${domainName}/oauth2/idpresponse`,
							`https://${versionDomainName}/oauth2/idpresponse`,
						],
					},
				}),
			}))
			// userPoolClientのプロパティを更新
			.then(({ scope, userPool, userPoolClient }) => {
				const cfnClient = userPoolClient.node.defaultChild as CfnUserPoolClient;
				cfnClient.addPropertyOverride("RefreshTokenValidity", 1);
				cfnClient.addPropertyOverride("SupportedIdentityProviders", [
					"COGNITO",
				]);

				return { scope, userPool, userPoolClient };
			})
			// userPoolDomainの作成
			.then(({ scope, userPool, userPoolClient }) => ({
				userPool,
				userPoolClient,
				userPoolDomain: new UserPoolDomain(scope, "Domain", {
					userPool,
					cognitoDomain: {
						domainPrefix: userPoolDomainPrefix,
					},
				}),
			}));
