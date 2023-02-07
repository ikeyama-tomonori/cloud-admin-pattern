import { App } from "aws-cdk-lib";
import {
  UserPool,
  UserPoolClient,
  UserPoolDomain,
} from "aws-cdk-lib/aws-cognito";
import { Vpc } from "aws-cdk-lib/aws-ec2";
import { DatabaseInstance } from "aws-cdk-lib/aws-rds";
import { HostedZone } from "aws-cdk-lib/aws-route53";
import { getStatelessStack } from ".";

describe("getStatelessStack", async () => {
  it("実行できる", async () => {
    const app = new App();

    const certificate = {};
    const cluster = {};
    const listener = {};
    const loadBalancer = {};
    const taskDefinition = {};

    const createCertificate = vi
      .fn()
      .mockReturnValueOnce(Promise.resolve({ certificate }));
    const createAlbService = vi
      .fn()
      .mockReturnValueOnce({ cluster, listener, loadBalancer });
    const createRdbMigrationTask = vi
      .fn()
      .mockReturnValueOnce({ taskDefinition });
    const createRunTaskOnce = vi.fn().mockImplementation(() => {});

    const statelessStack = getStatelessStack({
      name: "testStack",
      env: {},
      createCertificate,
      createAlbService,
      createRdbMigrationTask,
      createRunTaskOnce,
    });

    const result = await statelessStack({
      scope: app,
      vpc: {} as Vpc,
      db: {} as DatabaseInstance,
      hostedZone: {} as HostedZone,
      cognito: {
        userPool: {} as UserPool,
        userPoolClient: {} as UserPoolClient,
        userPoolDomain: {} as UserPoolDomain,
      },
    });

    expect(createCertificate).toHaveBeenCalled();
    expect(createAlbService).toHaveBeenCalled();
    expect(createRdbMigrationTask).toHaveBeenCalled();
    expect(createRunTaskOnce).toHaveBeenCalled();

    expect(result.loadBalancer).toBe(loadBalancer);
  });
});
