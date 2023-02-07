import { SecurityGroup, SubnetType, Connections } from "aws-cdk-lib/aws-ec2";
import { ICluster, LaunchType, TaskDefinition } from "aws-cdk-lib/aws-ecs";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import {
  DatabaseCluster,
  DatabaseInstance,
  ServerlessCluster,
} from "aws-cdk-lib/aws-rds";
import {
  AwsCustomResource,
  AwsCustomResourcePolicy,
  PhysicalResourceId,
} from "aws-cdk-lib/custom-resources";
import { Construct } from "constructs";

interface Config {
  name: string;
}

interface Params {
  scope: Construct;
  taskDefinition: TaskDefinition;
  cluster: ICluster;
  db: DatabaseCluster | DatabaseInstance | ServerlessCluster;
}

export default ({ name }: Config) =>
  (params: Params) =>
    Promise.resolve(params)
      // Custom Resourceの実行内容を定義
      .then(({ scope, taskDefinition, cluster, db }) => {
        const securityGroup = new SecurityGroup(scope, `${name}SecurityGroup`, {
          vpc: cluster.vpc,
        });
        const onEvent = {
          service: "ECS",
          action: "runTask",
          parameters: {
            cluster: cluster.clusterName,
            taskDefinition: taskDefinition.taskDefinitionArn,
            launchType: LaunchType.FARGATE,
            networkConfiguration: {
              awsvpcConfiguration: {
                assignPublicIp: "ENABLED",
                subnets: cluster.vpc.selectSubnets({
                  subnetType: SubnetType.PUBLIC,
                }).subnetIds,
                securityGroups: [securityGroup.securityGroupId],
              },
            },
          },
          physicalResourceId: PhysicalResourceId.of(
            taskDefinition.taskDefinitionArn,
          ),
        };
        return { scope, taskDefinition, db, onEvent, securityGroup };
      })
      // Custom Resourceの作成
      .then(({ scope, taskDefinition, db, onEvent, securityGroup }) => {
        const runTaskResource = new AwsCustomResource(scope, name, {
          onCreate: onEvent,
          onUpdate: onEvent,
          policy: AwsCustomResourcePolicy.fromSdkCalls({
            resources: [taskDefinition.taskDefinitionArn],
          }),
          logRetention: RetentionDays.ONE_WEEK,
          resourceType: "Custom::RunTask",
        });
        taskDefinition.taskRole.grantPassRole(runTaskResource.grantPrincipal);
        if (taskDefinition.executionRole)
          taskDefinition.executionRole.grantPassRole(
            runTaskResource.grantPrincipal,
          );

        return { db, securityGroup };
      })
      // DBへの接続を許可する
      .then(({ db, securityGroup }) => {
        const connections = new Connections({
          securityGroups: [securityGroup],
        });
        connections.allowToDefaultPort(db.connections);
      });
