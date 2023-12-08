import { APIGatewayEvent } from 'aws-lambda'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { buildResponse, getEnvironmentVariables, getErrorBody } from '../utils'

export const importProductsFile = async (event: APIGatewayEvent) => {
  console.log('importProductsFile: ', event)

  try {
    const fileName = event.queryStringParameters?.['name']
    const bucket = getEnvironmentVariables().BUCKET_NAME

    const client = new S3Client()
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: `uploaded/${fileName}`,
    })
    const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 })

    return buildResponse(200, signedUrl)
  } catch (e) {
    console.log('Error: ', e)
    return buildResponse(500, getErrorBody({ description: e }))
  }
}
