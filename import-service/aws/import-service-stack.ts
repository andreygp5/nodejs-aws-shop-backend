import { Stack, StackProps } from 'aws-cdk-lib'
import * as lambdaNodeJs from 'aws-cdk-lib/aws-lambda-nodejs'
import * as apiGateway from '@aws-cdk/aws-apigatewayv2-alpha'
import { HttpMethod } from '@aws-cdk/aws-apigatewayv2-alpha'
import { Construct } from 'constructs'
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha'
import * as s3 from 'aws-cdk-lib/aws-s3'
import { Runtime } from 'aws-cdk-lib/aws-lambda'
import { EnvironmentVariables } from '../src/interfaces'
import { LambdaDestination } from 'aws-cdk-lib/aws-s3-notifications'

export class ImportServiceStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const importServiceBucket = s3.Bucket.fromBucketName(
      this,
      'ImportServiceBucket',
      'aglazkov5-rs-aws-import-service'
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

    importServiceBucket.grantReadWrite(importProductsFileFunction)

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

    importsApiGateway.addRoutes({
      path: '/import',
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration(
        'ImportProductsFileIntegration',
        importProductsFileFunction
      ),
    })

    const importFileParserFunction = new lambdaNodeJs.NodejsFunction(
      this,
      'ImportFileParserFunction',
      {
        runtime: Runtime.NODEJS_18_X,
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

    importServiceBucket.grantReadWrite(importFileParserFunction)
  }
}
