import { Stack, StackProps } from 'aws-cdk-lib'
import * as lambdaNodeJs from 'aws-cdk-lib/aws-lambda-nodejs'
import * as apiGateway from '@aws-cdk/aws-apigatewayv2-alpha'
import { HttpMethod } from '@aws-cdk/aws-apigatewayv2-alpha'
import { Construct } from 'constructs'
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha'
import { LAMBDA_SHARED_PROPS } from './site-backend.constants'

export class SiteBackendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const getProductsFunction = new lambdaNodeJs.NodejsFunction(
      this,
      'GetProductsListFunction',
      {
        ...LAMBDA_SHARED_PROPS,
        entry: 'src/product/handlers/getProductsList.ts',
        handler: 'getProductsList',
      }
    )

    const getProductByIdFunction = new lambdaNodeJs.NodejsFunction(
      this,
      'GetProductsByIdFunction',
      {
        ...LAMBDA_SHARED_PROPS,
        entry: 'src/product/handlers/getProductsById.ts',
        handler: 'getProductsById',
      }
    )

    const createProductFunction = new lambdaNodeJs.NodejsFunction(
      this,
      'CreateProductFunction',
      {
        ...LAMBDA_SHARED_PROPS,
        entry: 'src/product/handlers/createProduct.ts',
        handler: 'createProduct',
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
