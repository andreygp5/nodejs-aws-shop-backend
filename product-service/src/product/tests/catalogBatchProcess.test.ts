import { SQSEvent } from 'aws-lambda'
import { PRODUCTS_MOCK } from './product.mock'
import { ProductRepository } from '../product.repository'
import { catalogBatchProcess } from '../handlers/catalogBatchProcess'
import { Product } from '../product.model'
import { mockClient } from 'aws-sdk-client-mock'
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns'
import 'aws-sdk-client-mock-jest'

jest.mock('../../utils', () => {
  const originalModule = jest.requireActual('../../utils')

  return {
    __esModule: true,
    ...originalModule,
    getEnvironmentVariables: () => {
      return { CREATE_PRODUCT_TOPIC_ARN: 'TEST_TOPIC' }
    },
  }
})

const snsMock = mockClient(SNSClient)

const mockCreateProduct = jest
  .spyOn(ProductRepository.prototype, 'createProduct')
  .mockImplementation((productDto) => {
    return Promise.resolve(productDto as Product)
  })

const mockEvent = {
  Records: [{ body: JSON.stringify(PRODUCTS_MOCK[0]) }],
} as SQSEvent

describe('CatalogBatchProcess', () => {
  beforeEach(() => {
    snsMock.reset()
    mockCreateProduct.mockReset()
  })

  it('should process the SQS messages and create products', async () => {
    await catalogBatchProcess(mockEvent)
    expect(mockCreateProduct).toHaveBeenCalledWith(PRODUCTS_MOCK[0], false)
  })

  it('should send messages to SNS topic', async () => {
    snsMock.on(PublishCommand).resolves({ MessageId: '1' })

    await catalogBatchProcess(mockEvent)
    expect(snsMock).toHaveReceivedCommand(PublishCommand)
  })
})
