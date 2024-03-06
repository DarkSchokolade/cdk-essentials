#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { VpcStack } from '../lib/vpc-stack';
import { BackendServiceStack } from '../lib/backend-service-stack';
import * as fs from 'fs';
import { snsStack } from '../lib/sns-stack';

const app = new cdk.App();

export interface BackendServiceProps {
  backendCpu?: number;
  backendMemroy?: number;
}

export interface AlarmConfig {
  metric: string;
  alarmName: string;
  threshold: number;
  evaluationPeriods: number;
}

export interface CommonStackProps {
  projectName: string;
  account: string;
  region: string;
  prefix: string;
  stackPrefix: string;
  backendConfig?: BackendServiceProps;
  backendAlarmConfigs: AlarmConfig[];
}

const configFilename = app.node.tryGetContext('config') || 'dev';
const configData = JSON.parse(
  fs.readFileSync(`config/${configFilename}.json`).toString()
);
const commonStackParams: CommonStackProps = <CommonStackProps>configData;

// Generate env
const env = {
  account: commonStackParams.account,
  region: commonStackParams.region,
};

const stackPrefix =
  commonStackParams.stackPrefix + commonStackParams.projectName;

const vpcStack = new VpcStack(app, `${stackPrefix}VpcStack`, {
  env,
});

const alarmTopic = new snsStack(
  app,
  commonStackParams.stackPrefix + 'BoredButtonSnsStack',
  {
    env,
    prefix: commonStackParams.stackPrefix,
    topicName: 'alarm-topic',
  }
);

const backendServiceStack = new BackendServiceStack(
  app,
  `${stackPrefix}BackendServiceStack`,
  {
    env,
    vpc: vpcStack.vpc,
    memory: commonStackParams.backendConfig?.backendMemroy,
    alarmConfigs: commonStackParams.backendAlarmConfigs,
    alarmTopic: alarmTopic.topic,
    stackPrefix: stackPrefix,
  }
);
