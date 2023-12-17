import { Duration, Stack, StackProps } from 'aws-cdk-lib'
import * as lambdaNodeJs from 'aws-cdk-lib/aws-lambda-nodejs'
import * as apiGateway from '@aws-cdk/aws-apigatewayv2-alpha'
import { HttpMethod } from '@aws-cdk/aws-apigatewayv2-alpha'
import { Construct } from 'constructs'
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as sqs from 'aws-cdk-lib/aws-sqs'
import { Runtime } from 'aws-cdk-lib/aws-lambda'
import { EnvironmentVariables } from '../src/interfaces'
import { LambdaDestination } from 'aws-cdk-lib/aws-s3-notifications'
import {
  HttpLambdaAuthorizer,
  HttpLambdaResponseType,
} from '@aws-cdk/aws-apigatewayv2-authorizers-alpha'

export class ImportServiceStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const importServiceBucket = s3.Bucket.fromBucketName(
      this,
      'ImportServiceBucket',
      'aglazkov5-rs-aws-import-service'
    )

    const catalogItemsQueue = sqs.Queue.fromQueueArn(
      this,
      'CatalogItemsQueue',
      this.formatArn({
        service: 'sqs',
        resource: 'CatalogItemsQueue',
      })
    )

    const importProductsFileFunction = new lambdaNodeJs.NodejsFunction(
      this,
      'ImportProductsFileFunction',
      {
        runtime: Runtime.NODEJS_18_X,
        environment: {
          BUCKET_NAME: importServiceBucket.bucketName,
        } as EnvironmentVariables,
        entry: './src/handlers/importProductsFile.ts',
        handler: 'importProductsFile',
      }
    )

    const importsApiGateway = new apiGateway.HttpApi(
      this,
      'ImportsApiGateway',
      {
        corsPreflight: {
          allowHeaders: ['*'],
          allowMethods: [apiGateway.CorsHttpMethod.ANY],
          allowOrigins: ['*'],
        },
      }
    )

    const basicAuthorizerFunction = lambdaNodeJs.NodejsFunction.fromFunctionArn(
      this,
      'BasicAuthorizerFunction',
      'arn:aws:lambda:eu-central-1:881032671006:function:BasicAuthorizerFunction'
    )

    const basicAuthorizer = new HttpLambdaAuthorizer(
      'BasicAuthorizer',
      basicAuthorizerFunction,
      {
        responseTypes: [HttpLambdaResponseType.SIMPLE],
        resultsCacheTtl: Duration.seconds(0),
      }
    )

    importsApiGateway.addRoutes({
      path: '/import',
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration(
        'ImportProductsFileIntegration',
        importProductsFileFunction
      ),
      authorizer: basicAuthorizer,
    })

    const importFileParserFunction = new lambdaNodeJs.NodejsFunction(
      this,
      'ImportFileParserFunction',
      {
        runtime: Runtime.NODEJS_18_X,
        environment: {
          QUEUE_NAME: catalogItemsQueue.queueUrl,
        },
        entry: './src/handlers/importFileParser.ts',
        handler: 'importFileParser',
      }
    )

    importServiceBucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new LambdaDestination(importFileParserFunction),
      {
        prefix: 'uploaded/',
      }
    )
    importServiceBucket.grantReadWrite(importProductsFileFunction)
    importServiceBucket.grantReadWrite(importFileParserFunction)
    catalogItemsQueue.grantSendMessages(importFileParserFunction)
  }
}
