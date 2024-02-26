import * as cdk from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';

interface BackendServiceStackProps extends cdk.StackProps {
  vpc: Vpc;
  cpu?: number;
  memory?: number;
  instanceCount?: number;
}

export class BackendServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: BackendServiceStackProps) {
    super(scope, id, props);

    // Fargate cluster
    const cluster = new ecs.Cluster(this, 'sksCluster', {
      vpc: props.vpc,
    });

    // Create a load-balanced Fargate service and make it public
    const backendService =
      new ecs_patterns.ApplicationLoadBalancedFargateService(
        this,
        'MyFargateService',
        {
          cluster: cluster,
          cpu: props.cpu || 256,
          desiredCount: props.instanceCount || 1,
          taskImageOptions: {
            image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
          },
          memoryLimitMiB: props.memory || 512,
          publicLoadBalancer: true, // Default is false
        }
      );
  }
}
