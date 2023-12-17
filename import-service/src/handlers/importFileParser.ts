import { S3Event } from 'aws-lambda'
import { buildResponse, getEnvironmentVariables, getErrorBody } from '../utils'
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { parse } from 'csv-parse'
import {
  SendMessageCommand,
  SendMessageCommandOutput,
  SQSClient,
} from '@aws-sdk/client-sqs'

export const importFileParser = async (event: S3Event) => {
  console.log('importFileParser: ', event)

  try {
    const s3File = event.Records[0].s3

    const s3Client = new S3Client()
    const sqsClient = new SQSClient()

    const sendMessageRequests: Promise<SendMessageCommandOutput>[] = []
    const getObjectCommandOutput = await s3Client.send(
      new GetObjectCommand({
        Bucket: s3File.bucket.name,
        Key: s3File.object.key,
      })
    )
    getObjectCommandOutput?.Body?.pipe(
      parse({
        fromLine: 2,
        columns: ['title', 'description', 'price', 'count'],
      })
    )
      .on('data', (row) => {
        sendMessageRequests.push(
          sqsClient.send(
            new SendMessageCommand({
              QueueUrl: getEnvironmentVariables().QUEUE_NAME,
              MessageBody: JSON.stringify(row),
            })
          )
        )

        console.log('Pushed to queue: ', row)
      })
      .on('error', (error: Error) => {
        console.error('Error parsing CSV: ', error)
      })

    await Promise.all(sendMessageRequests)

    console.log('All create Product SQS events successfully sent')

    await s3Client.send(
      new CopyObjectCommand({
        CopySource: `${s3File.bucket.name}/${s3File.object.key}`,
        Bucket: s3File.bucket.name,
        Key: `parsed/${s3File.object.key.split('/').slice(-1)}`,
      })
    )

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: s3File.bucket.name,
        Key: s3File.object.key,
      })
    )

    return buildResponse(200, {})
  } catch (e) {
    console.log('Error: ', e)
    return buildResponse(500, getErrorBody({ description: e }))
  }
}
