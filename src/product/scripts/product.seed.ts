import { PRODUCTS_MOCK } from '../tests/product.mock'
import { ProductRepository } from '../product.repository'
import omit from 'lodash/omit'
import { ProductDto } from '../product.model'

const productRepository = new ProductRepository()

const seedProducts = async () => {
  try {
    await Promise.all(
      PRODUCTS_MOCK.map(async (product) => {
        await productRepository.createProduct(omit(product, 'id') as ProductDto)
      })
    )
    console.log('Products successfully created')
  } catch (e) {
    console.log('Products creation failed')
    console.log(e)
  }
}

seedProducts()
