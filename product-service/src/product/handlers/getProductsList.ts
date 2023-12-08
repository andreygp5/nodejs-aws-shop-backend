import { ProductRepository } from '../product.repository'
import { APIGatewayEvent } from 'aws-lambda'
import { buildResponse, getErrorBody } from '../../utils'

export const getProductsList = async (event: APIGatewayEvent) => {
  console.log('getProductsList: ', event)

  try {
    const productsRepository = new ProductRepository()
    const allProducts = await productsRepository.getAllProducts()
    return buildResponse(200, allProducts)
  } catch (e) {
    console.log('Error: ', e)
    return buildResponse(500, getErrorBody({ description: e }))
  }
}
