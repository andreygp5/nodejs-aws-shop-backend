import { ProductRepository } from '../product.repository'
import { ValidationError } from 'yup'
import {
  buildResponse,
  getEnvironmentVariables,
  getErrorBody,
} from '../../utils'
import { SQSEvent } from 'aws-lambda'
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns'

export const catalogBatchProcess = async (event: SQSEvent) => {
  console.log('catalogBatchProcess: ', event)

  try {
    const snsClient = new SNSClient()
    const productsRepository = new ProductRepository()

    await Promise.all(
      event.Records.map(async (record) => {
        console.log('Going to create product: ', record.body)
        return productsRepository.createProduct(
          JSON.parse(record.body || ''),
          false
        )
      })
    )

    console.log('Products created')

    await snsClient.send(
      new PublishCommand({
        Message: 'Products created via the import',
        TopicArn: getEnvironmentVariables().CREATE_PRODUCT_TOPIC_ARN,
      })
    )

    console.log('Email notification sent via SNS')

    return buildResponse(200, {})
  } catch (e) {
    console.log('Error: ', e)

    if (e instanceof ValidationError) {
      return buildResponse(
        400,
        getErrorBody({
          message: 'Model validation error',
          description: e.errors.join('; '),
        })
      )
    }

    return buildResponse(500, getErrorBody({ description: e }))
  }
}
