import { Construct } from 'constructs';
import {
  aws_lambda as lambda,
  CfnOutput,
  Duration
} from 'aws-cdk-lib';
import * as apigv2 from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';

interface ApplicationAPIProps {
  inspectService: lambda.IFunction;
}

export class ApplicationAPI extends Construct {
  public readonly httpApi: apigv2.HttpApi;

  constructor(scope: Construct, id: string, props: ApplicationAPIProps) {
    super(scope, id);

    // API Gateway ------------------------------------------------------

    this.httpApi = new apigv2.HttpApi(this, 'HttpProxyApi', {
      apiName: 'photo-explorer-api',
      createDefaultStage: true,
      corsPreflight: {
        allowHeaders: ['Authorization', 'Content-Type', '*'],
        allowMethods: [
          apigv2.CorsHttpMethod.POST
        ],
        allowOrigins: ['http://localhost:3000', 'https://*'],
        allowCredentials: true,
        maxAge: Duration.days(10),
      },
    });

    // Inspect Service -------------------------------------------------

    const inspectServiceIntegration = new HttpLambdaIntegration('InspectIntegration',
      props.inspectService);

    this.httpApi.addRoutes({
      path: `/inspect/{filename}`,
      methods: [ apigv2.HttpMethod.POST ],
      integration: inspectServiceIntegration,
    });

    // Outputs -----------------------------------------------------------

    new CfnOutput(this, 'URL', {
      value: this.httpApi.apiEndpoint
    });
  
  }
}
