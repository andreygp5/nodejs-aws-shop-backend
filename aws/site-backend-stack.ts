import { Stack, StackProps } from "aws-cdk-lib";
import * as lambdaNodeJs from "aws-cdk-lib/aws-lambda-nodejs";
import * as apiGateway from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpMethod } from "@aws-cdk/aws-apigatewayv2-alpha";
import { Construct } from "constructs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";

export class SiteBackendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const getProductsFunction = new lambdaNodeJs.NodejsFunction(
      this,
      "GetProductsFunction",
      {
        runtime: Runtime.NODEJS_18_X,
        entry: "src/products/handlers/getProducts.ts",
        handler: "getProducts",
      },
    );

    const getProductByIdFunction = new lambdaNodeJs.NodejsFunction(
      this,
      "GetProductByIdFunction",
      {
        runtime: Runtime.NODEJS_18_X,
        entry: "src/products/handlers/getProductById.ts",
        handler: "getProductById",
      },
    );

    const productsApiGateway = new apiGateway.HttpApi(
      this,
      "ProductsApiGateway",
      {
        corsPreflight: {
          allowHeaders: ["*"],
          allowMethods: [apiGateway.CorsHttpMethod.ANY],
          allowOrigins: ["*"],
        },
      },
    );

    productsApiGateway.addRoutes({
      path: "/products",
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration(
        "GetProductsIntegration",
        getProductsFunction,
      ),
    });

    productsApiGateway.addRoutes({
      path: "/products/{productId}",
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration(
        "GetProductByIdIntegration",
        getProductByIdFunction,
      ),
    });
  }
}