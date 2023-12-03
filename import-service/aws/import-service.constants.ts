import { Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs'
import { EnvironmentVariables } from '../shared/environment.interfaces'
import { Effect } from 'aws-cdk-lib/aws-iam'
import * as iam from 'aws-cdk-lib/aws-iam'

const s3ReadWrite = new iam.PolicyStatement({
  actions: ['s3:*'],
  resources: ['arn:aws:s3:::YOUR_BUCKET/*'],
  effect: Effect.ALLOW,
})

export const LAMBDA_SHARED_PROPS: NodejsFunctionProps = {
  runtime: Runtime.NODEJS_18_X,
  environment: {
    BUCKET_NAME: 'products',
  } as EnvironmentVariables,
  initialPolicy: [s3ReadWrite],
}
