import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sns from 'aws-cdk-lib/aws-sns';

export interface snsStackProps extends cdk.StackProps {
  prefix: string;
  topicName: string;
}

export class snsStack extends cdk.Stack {
  public topic: cdk.aws_sns.Topic;
  constructor(scope: Construct, id: string, props: snsStackProps) {
    super(scope, id, props);

    this.topic = new sns.Topic(this, `${props.prefix}-${props.topicName}`);
  }
}
