import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as chatbot from 'aws-cdk-lib/aws-chatbot';
import {
  Effect,
  ManagedPolicy,
  PolicyDocument,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from 'aws-cdk-lib/aws-iam';

interface SlackChatBotStackProps extends cdk.StackProps {
  prefix: string;
  alarmTopics: cdk.aws_sns.ITopic[];
  slackChannelConfigurationName: string;
  slackWorkspaceId: string;
  slackChannelId: string;
}

export class SlackChatBotStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: SlackChatBotStackProps) {
    super(scope, id, props);

    const role = this.createRole();

    const target = new chatbot.SlackChannelConfiguration(
      this,
      `${props.prefix}-slack-chatbot`,
      {
        role,
        slackChannelConfigurationName: props.slackChannelConfigurationName,
        slackWorkspaceId: props.slackWorkspaceId,
        slackChannelId: props.slackChannelId,
        notificationTopics: props.alarmTopics,
      }
    );
  }

  private createRole(): cdk.aws_iam.Role {
    const role = new Role(this, 'BoredButtonSlackBotRole', {
      assumedBy: new ServicePrincipal('chatbot.amazonaws.com'),
      description: 'Role for AWS ChatBot',
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('ReadOnlyAccess'),
      ],
      inlinePolicies: {
        CloudwatchPolicy: new PolicyDocument({
          statements: [
            new PolicyStatement({
              effect: Effect.ALLOW,
              resources: ['*'],
              actions: [
                'cloudwatch:Describe*',
                'cloudwatch:Get*',
                'cloudwatch:List*',
              ],
            }),
          ],
        }),
      },
    });
    return role;
  }
}
