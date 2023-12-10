import { SQSEvent } from 'aws-lambda'
import { PRODUCTS_MOCK } from './product.mock'
import { ProductRepository } from '../product.repository'
import { catalogBatchProcess } from '../handlers/catalogBatchProcess'
import { Product } from '../product.model'

jest.mock('@aws-sdk/client-sns')

describe('CatalogBatchProcess', () => {
  it('should process the SQS messages and create products', async () => {
    const mockEvent = {
      Records: [{ body: JSON.stringify(PRODUCTS_MOCK[0]) }],
    } as SQSEvent

    const mockCreateProduct = jest
      .spyOn(ProductRepository.prototype, 'createProduct')
      .mockImplementation((productDto) => {
        return Promise.resolve(productDto as Product)
      })

    await catalogBatchProcess(mockEvent)
    expect(mockCreateProduct).toHaveBeenCalledWith(PRODUCTS_MOCK[0], false)
  })
})
