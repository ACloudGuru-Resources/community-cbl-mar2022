import { Construct } from 'constructs';
import {
  aws_s3 as s3,
  aws_cloudfront as cloudfront,
  CfnOutput,
  DockerImage
} from 'aws-cdk-lib';
import * as cwt from 'cdk-webapp-tools';
import * as apigv2 from '@aws-cdk/aws-apigatewayv2-alpha';

interface WebAppProps {
  relativeWebAppPath: string;
  baseDirectory: string;
  httpApi:apigv2.IHttpApi;
}

export class WebAppHosting extends Construct {

  public readonly webDistribution: cloudfront.CloudFrontWebDistribution;

  constructor(scope: Construct, id: string, props: WebAppProps) {
    super(scope, id);

    const hostingBucket = new s3.Bucket(this, 'HostingBucket', {})

    const oai = new cloudfront.OriginAccessIdentity(this, 'WebHostingOAI', {});

    const cloudfrontProps: any = {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: hostingBucket,
            originAccessIdentity: oai,
          },
          behaviors: [{ isDefaultBehavior: true }],
        },
      ],
      errorConfigurations: [
        {
          errorCachingMinTtl: 86400,
          errorCode: 403,
          responseCode: 200,
          responsePagePath: '/index.html',
        },
        {
          errorCachingMinTtl: 86400,
          errorCode: 404,
          responseCode: 200,
          responsePagePath: '/index.html',
        },
      ],
    };

    this.webDistribution = new cloudfront.CloudFrontWebDistribution(
      this,
      'AppHostingDistribution',
      cloudfrontProps,
    );

    hostingBucket.grantRead(oai);

    // Deploy Web App ----------------------------------------------------

    const deployment = new cwt.WebAppDeployment(this, 'WebAppDeploy', {
      baseDirectory: props.baseDirectory,
      relativeWebAppPath: props.relativeWebAppPath,
      webDistribution: this.webDistribution,
      webDistributionPaths: ['/*'],
      buildCommand: 'yarn build',
      buildDirectory: 'build',
      bucket: hostingBucket,
      prune: false,
      dockerImage: DockerImage.fromRegistry('public.ecr.aws/docker/library/node:16')
    });

    new CfnOutput(this, 'URL', {
      value: `https://${this.webDistribution.distributionDomainName}/`
    });

    // Web App Config ------------------------------------------------------

    new cwt.WebAppConfig(this, 'WebAppConfig', {
      bucket: hostingBucket,
      key: 'config.js',
      configData: {
        apiEndpoint: props.httpApi.apiEndpoint,
      },
      globalVariableName: 'appConfig'
    }).node.addDependency(deployment);
    
  }
}
