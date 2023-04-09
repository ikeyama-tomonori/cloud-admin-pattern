import { App, Stack } from "aws-cdk-lib";
import {
  UserPool,
  UserPoolClient,
  UserPoolDomain,
} from "aws-cdk-lib/aws-cognito";
import { Vpc } from "aws-cdk-lib/aws-ec2";
import { ApplicationLoadBalancer } from "aws-cdk-lib/aws-elasticloadbalancingv2";
import { ARecord, HostedZone } from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";
import {
  DatabaseInstance,
  DatabaseCluster,
  ServerlessCluster,
} from "aws-cdk-lib/aws-rds";

interface Config {
  createStatefulStack: (params: { scope: Construct }) => Promise<{
    stack: Stack;
    vpc: Vpc;
    db: DatabaseCluster | DatabaseInstance | ServerlessCluster;
    hostedZone: HostedZone;
    cognito: {
      userPool: UserPool;
      userPoolClient: UserPoolClient;
      userPoolDomain: UserPoolDomain;
    };
  }>;
  createStatelessStack: (params: {
    scope: Construct;
    vpc: Vpc;
    db: DatabaseCluster | DatabaseInstance | ServerlessCluster;
    hostedZone: HostedZone;
    cognito: {
      userPool: UserPool;
      userPoolClient: UserPoolClient;
      userPoolDomain: UserPoolDomain;
    };
  }) => Promise<{
    stack: Stack;
    loadBalancer: ApplicationLoadBalancer;
  }>;
  createHostNameStack: (params: {
    scope: Construct;
    hostedZone: HostedZone;
    loadBalancer: ApplicationLoadBalancer;
  }) => Promise<{
    stack: Stack;
    aRecord: ARecord;
  }>;
}

export default ({
    createStatefulStack,
    createStatelessStack,
    createHostNameStack,
  }: Config) =>
  () =>
    Promise.resolve()
      // Appの作成
      .then(() => ({
        app: new App(),
      }))
      // ステートフルスタックの作成
      .then(async ({ app }) => {
        const { stack, vpc, db, hostedZone, cognito } =
          await createStatefulStack({
            scope: app,
          });
        return {
          statefulStack: stack,
          app,
          vpc,
          db,
          hostedZone,
          cognito,
        };
      })
      // ステートレススタックの作成
      .then(async ({ statefulStack, app, vpc, db, hostedZone, cognito }) => {
        const { stack, loadBalancer } = await createStatelessStack({
          scope: app,
          vpc,
          db,
          hostedZone,
          cognito,
        });
        return {
          statefulStack,
          app,
          loadBalancer,
          hostedZone,
          statelessStack: stack,
        };
      })
      // ホスト名スタックの作成
      .then(
        async ({
          app,
          loadBalancer,
          hostedZone,
          statefulStack,
          statelessStack,
        }) => {
          const { stack } = await createHostNameStack({
            scope: app,
            loadBalancer,
            hostedZone,
          });

          return {
            statefulStack,
            statelessStack,
            hostNameStack: stack,
          };
        },
      );
