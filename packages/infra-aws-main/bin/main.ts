#!/usr/bin/env node
import { getApp } from '@infra-aws/app';
import {
    getAlbService,
    getRdbMigrationTask,
    getRdsServerless as getRds,
    getRunTaskOnce,
    getVpc,
} from '@infra-aws/resource';
import { getStatefulStack, getStatelessStack } from '@infra-aws/stack';

const env = {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
};

const config = {
    distDir: '../../dist',
};

const app = getApp({
    // ステートフル・リソース向けのスタック
    statefulStack: getStatefulStack({
        name: 'Stateful',
        // 3 Azを利用するため接続先を明示する
        env,
        // VPCリソース
        createVpc: getVpc({ name: 'Vpc', maxAzs: 3, natGateways: 1 }),
        // RDSリソース
        createRds: getRds({ name: 'Database' }),
    }),
    statelessStack: getStatelessStack({
        name: 'Stateless',
        env,
        // ALB Service
        createAlbService: getAlbService({
            name: 'AlbService',
            assetPath: `${config.distDir}/webapp`,
        }),
        // DB Migration用タスク定義
        createRdbMigrationTask: getRdbMigrationTask({
            name: 'Migration',
            assetPath: `${config.distDir}/migration`,
        }),
        createRunTaskOnce: getRunTaskOnce({ name: 'RunTaskOnce' }),
    }),
});

Promise.resolve(app());
