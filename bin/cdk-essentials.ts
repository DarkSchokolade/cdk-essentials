#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { VpcStack } from '../lib/vpc-stack';
import { BackendServiceStack } from '../lib/backend-service-stack';
import * as fs from 'fs';

const app = new cdk.App();

const configFilename = app.node.tryGetContext('config') || 'dev';
const configData = JSON.parse(
  fs.readFileSync(`config/${configFilename}.json`).toString()
);

const vpcStack = new VpcStack(app, 'cdkEssentialsVpcStack', {
  env: { account: '123456789012', region: 'ca-central-1' },
});

const backendServiceStack = new BackendServiceStack(
  app,
  'cdkEssentialsBackendServiceStack',
  {
    env: { account: '123456789012', region: 'ca-central-1' },
    vpc: vpcStack.vpc,
    memory: 1024,
  }
);
