import { Vpc, SubnetType } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

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
      .then(({ scope }) => ({
        vpc: new Vpc(scope, name, {
          maxAzs,
          natGateways,
          subnetConfiguration: [
            {
              subnetType: SubnetType.PUBLIC,
              name: "Public",
              cidrMask: 24,
            },
          ],
        }),
      }));
