import { APIGatewayEvent } from 'aws-lambda'
import { buildResponse, getErrorBody } from '../../../shared/utils'

export const importProductsFile = async (event: APIGatewayEvent) => {
  console.log('importProductsFile: ', event)

  try {
    const fileName = event.queryStringParameters?.['name']

    return buildResponse(200, '')
  } catch (e) {
    console.log('Error: ', e)
    return buildResponse(500, getErrorBody({ description: e }))
  }
}
