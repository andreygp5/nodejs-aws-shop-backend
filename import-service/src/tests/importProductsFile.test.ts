import { APIGatewayEvent } from 'aws-lambda'
import { importProductsFile } from '../handlers/importProductsFile'
import { buildResponse } from '../utils'

jest.mock('@aws-sdk/client-s3')
jest.mock('@aws-sdk/s3-request-presigner', () => {
  return {
    getSignedUrl: () => {
      return 'test-signed.xlsx'
    },
  }
})
jest.mock('../utils', () => {
  const originalModule = jest.requireActual('../utils')

  return {
    __esModule: true,
    ...originalModule,
    getEnvironmentVariables: () => {
      return { BUCKET_NAME: 'TEST_IMPORT' }
    },
  }
})

describe('ImportProductsFile', () => {
  it('should generate signed url', async () => {
    const handlerResp = await importProductsFile({
      queryStringParameters: { name: 'test.xlsx' },
    } as unknown as APIGatewayEvent)
    expect(handlerResp).toEqual(buildResponse(200, 'test-signed.xlsx'))
  })
})
