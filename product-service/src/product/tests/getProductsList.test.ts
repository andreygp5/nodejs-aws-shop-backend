import { getProductsList } from '../handlers/getProductsList'
import { PRODUCTS_MOCK } from './product.mock'
import { ProductRepository } from '../product.repository'
import { APIGatewayEvent } from 'aws-lambda'
import { buildResponse } from '../../utils'

describe('GetProductsList', () => {
  it('should return all products', async () => {
    jest
      .spyOn(ProductRepository.prototype, 'getAllProducts')
      .mockImplementation(() => {
        return Promise.resolve(PRODUCTS_MOCK)
      })

    const handlerResp = await getProductsList({} as unknown as APIGatewayEvent)
    expect(handlerResp).toEqual(buildResponse(200, PRODUCTS_MOCK))
  })
})
