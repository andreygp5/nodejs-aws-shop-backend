import { Stack, StackProps } from 'aws-cdk-lib'
import * as lambdaNodeJs from 'aws-cdk-lib/aws-lambda-nodejs'
import * as apiGateway from '@aws-cdk/aws-apigatewayv2-alpha'
import { HttpMethod } from '@aws-cdk/aws-apigatewayv2-alpha'
import { Construct } from 'constructs'
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha'
import { LAMBDA_SHARED_PROPS } from './import-service.constants'

export class ImportServiceStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const importProductsFileFunction = new lambdaNodeJs.NodejsFunction(
      this,
      'ImportProductsFileFunction',
      {
        ...LAMBDA_SHARED_PROPS,
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

    importsApiGateway.addRoutes({
      path: '/import',
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration(
        'ImportProductsFileIntegration',
        importProductsFileFunction
      ),
    })
  }
}
