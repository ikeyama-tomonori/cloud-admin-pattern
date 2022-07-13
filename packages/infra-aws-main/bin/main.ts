#!/usr/bin/env node
import { getApp } from '@infra-aws/app';
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
    getHostNameStack,
    getStatefulStack,
    getStatelessStack,
} from '@infra-aws/stack';

const env = {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
};

const config = {
    distDir: '../../dist',
    domianName: process.env.CDK_APP_DOMAIN_NAME,
    version: process.env.CDK_APP_VERSION,
    userPoolDomainPrefix: 'abjbgatip7y7',
};

if (!config.domianName) throw new Error('CDK_APP_DOMAIN_NAME is not set');
if (!config.version) throw new Error('CDK_APP_VERSION is not set');

const app = getApp({
    // ステートフル・リソース向けのスタック
    statefulStack: getStatefulStack({
        name: 'Stateful',
        // 3 Azを利用するため接続先を明示する
        env,
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
    statelessStack: getStatelessStack({
        name: `StatelessV${config.version}`,
        env,
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
    hostNameStack: getHostNameStack({
        name: 'HostName',
        env,
        createARecord: getARecord({ name: 'ARecord' }),
    }),
});

app();
