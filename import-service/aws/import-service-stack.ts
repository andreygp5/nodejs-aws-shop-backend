import { Stack, StackProps } from 'aws-cdk-lib'
import * as lambdaNodeJs from 'aws-cdk-lib/aws-lambda-nodejs'
import * as apiGateway from '@aws-cdk/aws-apigatewayv2-alpha'
import { HttpMethod } from '@aws-cdk/aws-apigatewayv2-alpha'
import { Construct } from 'constructs'
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha'

export class ImportServiceStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const importProductsFileFunction = new lambdaNodeJs.NodejsFunction(
      this,
      'ImportProductsFileFunction',
      {
        entry: 'src/product/handlers/getProductsList.ts',
        handler: 'getProductsList',
      }
    )

    const productsApiGateway = new apiGateway.HttpApi(
      this,
      'ProductsApiGateway',
      {
        corsPreflight: {
          allowHeaders: ['*'],
          allowMethods: [apiGateway.CorsHttpMethod.ANY],
          allowOrigins: ['*'],
        },
      }
    )

    productsApiGateway.addRoutes({
      path: '/products',
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration(
        'GetProductsListIntegration',
        getProductsFunction
      ),
    })

    productsApiGateway.addRoutes({
      path: '/products/{productId}',
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration(
        'GetProductsByIdIntegration',
        getProductByIdFunction
      ),
    })

    productsApiGateway.addRoutes({
      path: '/products',
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration(
        'CreateProductIntegration',
        createProductFunction
      ),
    })
  }
}
