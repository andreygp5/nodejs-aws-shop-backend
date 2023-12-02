import { APIGatewayEvent } from 'aws-lambda'
import { buildResponse, getErrorBody } from '../../utils'
import { ProductRepository } from '../product.repository'

export const getProductsById = async (event: APIGatewayEvent) => {
  console.log('getProductsById: ', event)

  try {
    const productId = event.pathParameters?.['productId']
    const productsRepository = new ProductRepository()
    const product = await productsRepository.getProductById(productId!)

    if (!product) {
      return buildResponse(404, getErrorBody({ message: 'Product not found' }))
    }

    return buildResponse(200, product)
  } catch (e) {
    console.log('Error: ', e)
    return buildResponse(500, getErrorBody({ description: e }))
  }
}
