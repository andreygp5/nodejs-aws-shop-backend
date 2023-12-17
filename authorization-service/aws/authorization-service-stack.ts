import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as lambdaNodeJs from 'aws-cdk-lib/aws-lambda-nodejs'
import { CfnPermission, Runtime } from 'aws-cdk-lib/aws-lambda'
import 'dotenv/config'

export class AuthorizationServiceStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const basicAuthorizerFunction = new lambdaNodeJs.NodejsFunction(
      this,
      'BasicAuthorizerFunction',
      {
        runtime: Runtime.NODEJS_18_X,
        entry: './src/handlers/basicAuthorizer.ts',
        handler: 'basicAuthorizer',
        functionName: 'BasicAuthorizerFunction',
        environment: {
          andreygp5: process.env.andreygp5 || '',
        },
      }
    )

    new CfnPermission(this, 'BasicAuthorizerInvokePermission', {
      action: 'lambda:InvokeFunction',
      functionName: basicAuthorizerFunction.functionName,
      principal: 'apigateway.amazonaws.com',
      sourceAccount: this.account,
    })
  }
}
