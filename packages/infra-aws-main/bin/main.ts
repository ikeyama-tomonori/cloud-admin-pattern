#!/usr/bin/env node
import getMain from "./getMain";

const account = process.env.CDK_DEFAULT_ACCOUNT;
const region = process.env.CDK_DEFAULT_REGION;
const domianName = process.env.CDK_APP_DOMAIN_NAME;
const version = process.env.CDK_APP_VERSION;
const userPoolDomainPrefix = process.env.CDK_APP_USER_POOL_DOMAIN_PREFIX;

if (!account) throw new Error("CDK_DEFAULT_ACCOUNT is not set");
if (!region) throw new Error("CDK_DEFAULT_REGION is not set");
if (!domianName) throw new Error("CDK_APP_DOMAIN_NAME is not set");
if (!version) throw new Error("CDK_APP_VERSION is not set");
if (!userPoolDomainPrefix)
  throw new Error("CDK_APP_USER_POOL_DOMAIN_PREFIX is not set");

const config = {
  env: {
    account,
    region,
  },
  distDir: "../../dist",
  domianName,
  version,
  userPoolDomainPrefix: "abjbgatip7y7",
};

const main = getMain(config);

main();
