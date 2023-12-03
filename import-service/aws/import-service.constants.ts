import { Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Effect } from 'aws-cdk-lib/aws-iam'
import * as iam from 'aws-cdk-lib/aws-iam'
import { EnvironmentVariables } from '../src/interfaces'

const s3ReadWrite = new iam.PolicyStatement({
  actions: ['s3:*'],
  resources: ['arn:aws:s3:::aglazkov5-rs-aws-import-service/*'],
  effect: Effect.ALLOW,
})

export const LAMBDA_SHARED_PROPS: NodejsFunctionProps = {
  runtime: Runtime.NODEJS_18_X,
  environment: {
    BUCKET_NAME: 'aglazkov5-rs-aws-import-service',
  } as EnvironmentVariables,
  initialPolicy: [s3ReadWrite],
}
