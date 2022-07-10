import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import {
    ApplicationListener,
    ListenerCertificate,
} from 'aws-cdk-lib/aws-elasticloadbalancingv2';

interface Config {
    name: string;
}

interface Params {
    listener: ApplicationListener;
    certificate: Certificate;
}

export default ({ name }: Config) =>
    (params: Params) =>
        Promise.resolve(params)
            // Targetの作成
            .then(({ listener, certificate }) => {
                listener.addCertificates(name, [
                    ListenerCertificate.fromCertificateManager(certificate),
                ]);
            });
