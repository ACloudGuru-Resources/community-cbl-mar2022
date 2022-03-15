import * as path from 'path';
import { Stack, StackProps, aws_lambda_nodejs as ln, Duration, aws_lambda as lambda } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { WebAppHosting } from './hosting';
import { ApplicationAPI } from './api';


export class InfrastructureStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const inspectService = new ln.NodejsFunction(this, 'InspectService', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'handler',
      entry: path.join(__dirname, '../../services/inspect/index.js'),
      timeout: Duration.seconds(90),
      memorySize: 1024
    })
    
    const api = new ApplicationAPI(this, 'AppAPI', {
      inspectService: inspectService
    })

    new WebAppHosting(this, 'Hosting', {
      baseDirectory: '../',
      relativeWebAppPath: 'webapp',
      httpApi: api.httpApi
    })
    
  }
}
