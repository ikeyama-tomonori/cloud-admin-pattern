import {
    getAlbService,
    getARecord,
    getCertificate,
    getCognito,
    getRdbMigrationTask,
    getRdsMysql as getRds,
    getRoute53,
    getRunTaskOnce,
    getVpc,
} from '@infra-aws/resource';
import {
    getApp,
    getHostNameStack,
    getStatefulStack,
    getStatelessStack,
} from '@infra-aws/stack';

interface Config {
    env: {
        account: string;
        region: string;
    };
    distDir: string;
    domianName: string;
    version: string;
    userPoolDomainPrefix: string;
}

export default (config: Config) => () => {
    const app = getApp({
        // ステートフル・リソース向けのスタック
        createStatefulStack: getStatefulStack({
            name: 'Stateful',
            // 3 Azを利用するため接続先を明示する
            env: config.env,
            createRoute53: getRoute53({
                name: 'HostedZone',
                zoneName: config.domianName,
            }),
            // VPCリソース
            createVpc: getVpc({ name: 'Vpc', maxAzs: 2, natGateways: 0 }),
            // RDSリソース
            createRds: getRds({ name: 'Database' }),
            // Cognitoリソース
            createCognito: getCognito({
                name: 'Cognito',
                domainName: config.domianName,
                versionDomainName: `v${config.version}.${config.domianName}`,
                userPoolDomainPrefix: config.userPoolDomainPrefix,
            }),
        }),
        createStatelessStack: getStatelessStack({
            name: `StatelessV${config.version}`,
            env: config.env,
            // 証明書を作成
            createCertificate: getCertificate({
                name: 'Certificate',
                domainName: config.domianName,
            }),
            // ALB Service を作成
            // バージョン付きのドメイン名で作成する
            createAlbService: getAlbService({
                name: 'AlbService',
                assetPath: `${config.distDir}/webapp`,
                domainName: `v${config.version}.${config.domianName}`,
            }),
            // DB Migration用タスク定義
            createRdbMigrationTask: getRdbMigrationTask({
                name: 'Migration',
                assetPath: `${config.distDir}/migration`,
            }),
            createRunTaskOnce: getRunTaskOnce({ name: 'RunTaskOnce' }),
        }),
        createHostNameStack: getHostNameStack({
            name: 'HostName',
            env: config.env,
            createARecord: getARecord({ name: 'ARecord' }),
        }),
    });

    return app();
};
