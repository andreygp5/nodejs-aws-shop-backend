import { APIGatewayEvent } from 'aws-lambda'
import { buildResponse, getErrorBody } from '../../utils'
import { ProductRepository } from '../product.repository'
import { ValidationError } from 'yup'

export const createProduct = async (event: APIGatewayEvent) => {
  console.log('createProduct: ', event)

  try {
    const productsRepository = new ProductRepository()
    const createdProduct = await productsRepository.createProduct(
      JSON.parse(event.body || '')
    )

    if (createdProduct) {
      return buildResponse(200, createdProduct)
    } else {
      return buildResponse(
        500,
        getErrorBody({ message: 'Failed to create a product' })
      )
    }
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
