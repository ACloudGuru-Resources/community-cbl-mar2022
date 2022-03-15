import { Stack, StackProps, Stage, StageProps, pipelines } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { InfrastructureStack } from './infrastructure-stack';

class WebApplication extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    new InfrastructureStack(this, 'WebApplication', {
      env: {
        account: '296346829892',
        region: 'us-east-1'
      }
    });

  }
}

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.connection('davidtucker/cbl-mar2022-personal', 'main', {
          connectionArn: 'arn:aws:codestar-connections:us-east-1:296346829892:connection/cfcbb28e-7f22-43b5-bd37-272bb046c70e',
        }),
        commands: [
          'yarn install --frozen-lockfile', 
          'cd infrastructure', 
          'npx cdk synth'
        ],
        primaryOutputDirectory: 'infrastructure/cdk.out',
      }),
      dockerEnabledForSynth: true
    });

    pipeline.addStage(new WebApplication(this, 'WebApplication', {}));

  }
}
