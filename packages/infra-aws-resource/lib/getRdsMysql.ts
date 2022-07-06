import {
    InstanceClass,
    InstanceSize,
    InstanceType,
    SubnetType,
    Vpc,
} from 'aws-cdk-lib/aws-ec2';
import {
    DatabaseInstance,
    DatabaseInstanceEngine,
    MysqlEngineVersion,
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
    (params: Params) =>
        Promise.resolve(params)
            // RDS 作成
            .then(
                ({ scope, vpc }) =>
                    new DatabaseInstance(scope, name, {
                        engine: DatabaseInstanceEngine.mysql({
                            version: MysqlEngineVersion.VER_8_0_28,
                        }),
                        instanceType: InstanceType.of(
                            InstanceClass.BURSTABLE4_GRAVITON,
                            InstanceSize.MICRO
                        ),
                        vpc,
                        vpcSubnets: {
                            subnetType: SubnetType.PUBLIC,
                        },
                    })
            );
