import {
    InstanceClass,
    InstanceSize,
    InstanceType,
    SubnetType,
    Vpc,
} from 'aws-cdk-lib/aws-ec2';
import {
    DatabaseCluster,
    DatabaseClusterEngine,
    AuroraMysqlEngineVersion,
} from 'aws-cdk-lib/aws-rds';
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
                    new DatabaseCluster(scope, name, {
                        engine: DatabaseClusterEngine.auroraMysql({
                            version: AuroraMysqlEngineVersion.VER_2_10_2,
                        }),
                        instanceProps: {
                            instanceType: InstanceType.of(
                                InstanceClass.BURSTABLE3,
                                InstanceSize.SMALL
                            ),
                            vpcSubnets: {
                                subnetType: SubnetType.PRIVATE_ISOLATED,
                            },
                            vpc,
                        },
                    })
            );
