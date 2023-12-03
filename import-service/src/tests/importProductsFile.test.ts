import { APIGatewayEvent } from 'aws-lambda'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { importProductsFile } from '../handlers/importProductsFile'
import { getEnvironmentVariables } from '../utils'
import { buildResponse } from '../../../shared/utils'

jest.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: function() {},
    PutObjectCommand: function() {
      return 'test-signed.xlsx'
    }
  }
})
jest.mock('@aws-sdk/s3-request-presigner', () => {
  return {
    getEnvironmentVariables: () => {
      return { BUCKET_NAME: 'TEST_IMPORT' }
    },
  }
})
jest.mock('../utils', () => {
  return {
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
