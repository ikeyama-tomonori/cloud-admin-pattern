import { RunTask } from 'cdk-fargate-run-task';
import { TaskDefinition, ICluster } from 'aws-cdk-lib/aws-ecs';
import { Construct } from 'constructs';
import {
    DatabaseCluster,
    DatabaseInstance,
    ServerlessCluster,
} from 'aws-cdk-lib/aws-rds';

interface Config {
    name: string;
}

interface Params {
    scope: Construct;
    task: TaskDefinition;
    cluster: ICluster;
    db: DatabaseCluster | DatabaseInstance | ServerlessCluster;
}

export default ({ name }: Config) =>
    (params: Params) =>
        Promise.resolve(params)
            // RunTask(カスタムリソース)の作成
            .then(({ scope, task, cluster, db }) => {
                const runTask = new RunTask(scope, name, {
                    task,
                    cluster,
                    runOnResourceUpdate: true,
                });
                runTask.connections.allowToDefaultPort(db.connections);
            });
