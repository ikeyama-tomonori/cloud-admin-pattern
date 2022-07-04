import { SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { ServerlessCluster, DatabaseClusterEngine } from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';

interface Config {
    name: string;
}

interface Params {
    scope: Construct;
    vpc: Vpc;
}

export default ({ name }: Config) =>
    (handler: Promise<Params>) =>
        handler
            // RDS 作成
            .then(
                ({ scope, vpc }) =>
                    new ServerlessCluster(scope, name, {
                        enableDataApi: true,
                        engine: DatabaseClusterEngine.AURORA_MYSQL,
                        vpc,
                        vpcSubnets: {
                            subnetType: SubnetType.PRIVATE_ISOLATED,
                        },
                    })
            );
