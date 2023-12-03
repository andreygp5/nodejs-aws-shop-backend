import { S3Event } from 'aws-lambda'
import { buildResponse, getErrorBody } from '../utils'
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { parse } from 'csv-parse'

export const importFileParser = async (event: S3Event) => {
  console.log('importFileParser: ', event)

  try {
    const s3File = event.Records[0].s3
    const client = new S3Client()
    const getObjectCommandOutput = await client.send(
      new GetObjectCommand({
        Bucket: s3File.bucket.name,
        Key: s3File.object.key,
      })
    )

    await (getObjectCommandOutput?.Body as ReadableStream)
      ?.pipe(parse())
      .on('data', (row: string) => {
        console.log(row)
      })
      .on('error', (error: Error) => {
        console.error('Error parsing CSV:', error)
      })

    await client.send(
      new CopyObjectCommand({
        CopySource: `${s3File.bucket.name}/${s3File.object.key}`,
        Bucket: s3File.bucket.name,
        Key: `parsed/${s3File.object.key.split('/').slice(-1)}`,
      })
    )

    await client.send(
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
