import { Vpc, SubnetType } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

interface Config {
    name: string;
    maxAzs?: number;
    natGateways?: number;
}

interface Params {
    scope: Construct;
}

export default ({ name, maxAzs, natGateways }: Config) =>
    (params: Params) =>
        Promise.resolve(params)
            // VPC 作成
            .then(
                ({ scope }) =>
                    new Vpc(scope, name, {
                        cidr: '10.0.0.0/16',
                        maxAzs,
                        natGateways,
                        subnetConfiguration: [
                            {
                                subnetType: SubnetType.PUBLIC,
                                name: 'Ingress',
                                cidrMask: 24,
                            },
                            {
                                subnetType: SubnetType.PRIVATE_WITH_NAT,
                                name: 'Application',
                                cidrMask: 24,
                            },
                            {
                                subnetType: SubnetType.PRIVATE_ISOLATED,
                                name: 'Database',
                                cidrMask: 24,
                            },
                        ],
                    })
            );
