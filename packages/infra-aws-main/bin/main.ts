#!/usr/bin/env node
import { getApp } from '@infra-aws/app';
import {
    getAlbService,
    getARecord,
    getCertificate,
    getCertificateAdd,
    getRdbMigrationTask,
    getRdsServerless as getRds,
    getRoute53,
    getRunTaskOnce,
    getVpc,
} from '@infra-aws/resource';
import {
    getHostedZoneStack,
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
};

if (!config.domianName) throw new Error('CDK_APP_DOMAIN_NAME is not set');
if (!config.version) throw new Error('CDK_APP_VERSION is not set');

const app = getApp({
    // DNSにZoneを作成
    hostedZoneStack: getHostedZoneStack({
        name: 'Dns',
        env,
        createRoute53: getRoute53({
            name: 'HostedZone',
            zoneName: config.domianName,
        }),
    }),
    // ステートフル・リソース向けのスタック
    statefulStack: getStatefulStack({
        name: 'Stateful',
        // 3 Azを利用するため接続先を明示する
        env,

        // VPCリソース
        createVpc: getVpc({ name: 'Vpc', maxAzs: 2, natGateways: 0 }),
        // RDSリソース
        createRds: getRds({ name: 'Database' }),
    }),
    statelessStack: getStatelessStack({
        name: `StatelessV${config.version}`,
        env,
        // ALB Service
        createAlbService: getAlbService({
            name: 'AlbService',
            assetPath: `${config.distDir}/webapp`,
            domainName: `v${config.version}.${config.domianName}`,
        }),
        createCertificate: getCertificate({
            name: 'Certificate',
            domainName: config.domianName,
        }),
        addCertificate: getCertificateAdd({ name: 'ListenerCertificate' }),
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
