import { APIGatewayEvent } from 'aws-lambda'
import { getProductsById } from '../handlers/getProductsById'
import { PRODUCTS_MOCK } from './product.mock'
import { ProductRepository } from '../product.repository'
import { buildResponse } from '../../utils'

describe('GetProductsById', () => {
  it('should return product by id', async () => {
    const productId = '1'
    const product = PRODUCTS_MOCK.find((product) => product.id === productId)

    jest
      .spyOn(ProductRepository.prototype, 'getProductById')
      .mockImplementation(() => {
        return Promise.resolve(product)
      })

    const handlerResp = await getProductsById({
      pathParameters: { productId },
    } as unknown as APIGatewayEvent)
    expect(handlerResp).toEqual(buildResponse(200, product))
  })

  it('should return 404 if product can not be found', async () => {
    jest
      .spyOn(ProductRepository.prototype, 'getProductById')
      .mockImplementation(() => {
        return Promise.resolve(undefined)
      })

    const handlerResp = await getProductsById({
      pathParameters: { productId: '100' },
    } as unknown as APIGatewayEvent)
    expect(handlerResp.statusCode).toBe(404)
  })
})
