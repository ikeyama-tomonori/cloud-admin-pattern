import {
    Certificate,
    CertificateValidation,
} from 'aws-cdk-lib/aws-certificatemanager';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';

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
                certificate: new Certificate(scope, name, {
                    domainName,
                    validation: CertificateValidation.fromDns(hostedZone),
                }),
            }));
