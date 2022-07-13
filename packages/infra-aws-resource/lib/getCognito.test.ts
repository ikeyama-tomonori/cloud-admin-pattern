import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import getCognito from './getCognito';

describe('getCognito', () => {
    it('UserPool, UserPoolClient, UserPoolDomainが作成できる', async () => {
        const app = new App();
        const stack = new Stack(app, 'test', {
            env: { account: '000000000000', region: 'ap-northeast-1' },
        });

        const createCognito = getCognito({
            name: 'TestUserPool',
            domainName: 'test.example.com',
            versionDomainName: 'v1.test.example.com',
            userPoolDomainPrefix: 'test-prefix',
        });
        await createCognito({ scope: stack });

        const template = Template.fromStack(stack);

        template.hasResourceProperties('AWS::Cognito::UserPool', {
            AccountRecoverySetting: {
                RecoveryMechanisms: [
                    {
                        Name: 'verified_phone_number',
                        Priority: 1,
                    },
                    {
                        Name: 'verified_email',
                        Priority: 2,
                    },
                ],
            },
            AdminCreateUserConfig: {
                AllowAdminCreateUserOnly: true,
            },
        });

        template.hasResourceProperties('AWS::Cognito::UserPoolClient', {
            AllowedOAuthFlows: ['code'],
            AllowedOAuthFlowsUserPoolClient: true,
            AllowedOAuthScopes: ['email', 'openid'],
            CallbackURLs: [
                'https://test.example.com/oauth2/idpresponse',
                'https://v1.test.example.com/oauth2/idpresponse',
            ],
            ExplicitAuthFlows: [
                'ALLOW_USER_PASSWORD_AUTH',
                'ALLOW_REFRESH_TOKEN_AUTH',
            ],
            GenerateSecret: true,
            RefreshTokenValidity: 1,
            SupportedIdentityProviders: ['COGNITO'],
        });

        template.hasResourceProperties('AWS::Cognito::UserPoolDomain', {
            Domain: 'test-prefix',
        });
    });
});
