import { HostedZone } from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";

interface Config {
  name: string;
  zoneName: string;
}

interface Params {
  scope: Construct;
}

export default ({ name, zoneName }: Config) =>
  (params: Params) =>
    Promise.resolve(params)
      // HostedZoneの作成
      .then(({ scope }) => ({
        hostedZone: new HostedZone(scope, name, {
          zoneName,
        }),
      }));
