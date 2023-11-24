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
      "GetProductsListFunction",
      {
        runtime: Runtime.NODEJS_18_X,
        entry: "src/products/handlers/getProductsList.ts",
        handler: "getProductsList",
      },
    );

    const getProductByIdFunction = new lambdaNodeJs.NodejsFunction(
      this,
      "GetProductsByIdFunction",
      {
        runtime: Runtime.NODEJS_18_X,
        entry: "src/products/handlers/getProductsById.ts",
        handler: "getProductsById",
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
        "GetProductsListIntegration",
        getProductsFunction,
      ),
    });

    productsApiGateway.addRoutes({
      path: "/products/{productId}",
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration(
        "GetProductsByIdIntegration",
        getProductByIdFunction,
      ),
    });
  }
}
