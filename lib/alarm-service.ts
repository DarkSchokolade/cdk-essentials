import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as cw_actions from 'aws-cdk-lib/aws-cloudwatch-actions';

export interface AlarmStackProps {
  metric: cdk.aws_cloudwatch.Metric;
  alarmName: string;
  alarmThreshold: number;
  alarmEvaluationPeriods: number;
  alarmTopic: cdk.aws_sns.Topic;
}

export class AlarmService extends Construct {
  constructor(scope: Construct, id: string, props: AlarmStackProps) {
    super(scope, id);

    const alarm = new cloudwatch.Alarm(this, 'alarm', {
      metric: props.metric,
      alarmName: props.alarmName,
      threshold: props.alarmThreshold,
      evaluationPeriods: props.alarmEvaluationPeriods,
    });

    alarm.addAlarmAction(new cw_actions.SnsAction(props.alarmTopic));
    alarm.addOkAction(new cw_actions.SnsAction(props.alarmTopic));
  }
}
