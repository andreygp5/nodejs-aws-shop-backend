import { NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs/lib/function'
import { Runtime } from 'aws-cdk-lib/aws-lambda'
import { EnvironmentVariables } from '../src/interfaces'
import * as iam from 'aws-cdk-lib/aws-iam'
import { Effect } from 'aws-cdk-lib/aws-iam'

const dynamoDBReadWrite = new iam.PolicyStatement({
  actions: ['dynamodb:*'],
  resources: ['*'],
  effect: Effect.ALLOW,
})

export const LAMBDA_SHARED_PROPS: NodejsFunctionProps = {
  runtime: Runtime.NODEJS_18_X,
  initialPolicy: [dynamoDBReadWrite],
  environment: {
    PRODUCT_TABLE_NAME: 'Product',
    STOCK_TABLE_NAME: 'Stock',
  } as EnvironmentVariables,
}
