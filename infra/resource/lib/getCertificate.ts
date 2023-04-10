import { DnsValidatedCertificate } from "aws-cdk-lib/aws-certificatemanager";
import { HostedZone } from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";

interface Config {
  name: string;
  domainName: string;
}

interface Params {
  scope: Construct;
  hostedZone: HostedZone;
}

export default ({ name, domainName }: Config) =>
  (params: Params) =>
    Promise.resolve(params)
      // 証明書の作成
      .then(({ scope, hostedZone }) => ({
        certificate: new DnsValidatedCertificate(scope, name, {
          domainName,
          hostedZone,
          cleanupRoute53Records: true,
          // サブドメインへのワイルドカード証明を追加
          subjectAlternativeNames: [`*.${domainName}`],
        }),
      }));
