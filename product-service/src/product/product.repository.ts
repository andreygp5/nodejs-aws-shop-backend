import {
  Product,
  ProductDto,
  productDtoSchema,
  ProductTable,
} from './product.model'
import {
  PutCommand,
  QueryCommand,
  ScanCommand,
  TransactWriteCommand,
} from '@aws-sdk/lib-dynamodb'
import { getEnvironmentVariables, getUniqueId } from '../utils'
import { ValidationError } from 'yup'
import { AbstractRepository } from '../abstract-repository'
import { StockRepository } from '../stock/stock.repository'
import omit from 'lodash/omit'

export class ProductRepository extends AbstractRepository {
  TABLE_NAME = getEnvironmentVariables().PRODUCT_TABLE_NAME
  private stockRepository = new StockRepository()

  public async getAllProducts(): Promise<Product[]> {
    const products = (
      await this.dynamoDBClient.send(
        new ScanCommand({
          TableName: this.TABLE_NAME,
        })
      )
    )?.Items as ProductTable[]

    const stocks = await this.stockRepository.getAllStocks()

    return products.map((product) => {
      const stock = stocks.find((stock) => stock.product_id === product.id)

      return {
        ...product,
        count: stock?.count || 0,
      }
    })
  }

  public async getProductById(id: string): Promise<Product | undefined> {
    const product = (
      await this.dynamoDBClient.send(
        new QueryCommand({
          TableName: this.TABLE_NAME,
          KeyConditionExpression: 'id = :id',
          ExpressionAttributeValues: {
            ':id': id,
          },
        })
      )
    )?.Items?.[0] as ProductTable

    if (!product) {
      return
    }

    const stock = await this.stockRepository.getStockById(product.id)

    return {
      ...product,
      count: stock?.count || 0,
    }
  }

  public async createProduct(
    productDto: ProductDto,
    isStrictValidation = true
  ): Promise<Product | undefined> {
    const productDtoValidationErrors = await this.getProductDtoValidationErrors(
      productDto,
      isStrictValidation
    )

    if (productDtoValidationErrors) {
      throw productDtoValidationErrors
    }

    const productId = getUniqueId()

    new PutCommand({
      TableName: this.TABLE_NAME,
      Item: { ...omit(productDto, 'count'), id: productId },
    })

    await this.dynamoDBClient.send(
      new TransactWriteCommand({
        TransactItems: [
          {
            Put: {
              TableName: this.TABLE_NAME,
              Item: { ...omit(productDto, 'count'), id: productId },
            },
          },
          {
            Put: this.stockRepository.getTransactItemsPut({
              product_id: productId,
              count: productDto.count!,
            }),
          },
        ],
      })
    )

    return this.getProductById(productId)
  }

  public async getProductDtoValidationErrors(
    productDtoObject: any,
    isStrictValidation = true
  ): Promise<ValidationError | undefined> {
    const validationResult = await productDtoSchema
      .validate(productDtoObject, {
        strict: isStrictValidation,
        abortEarly: false,
      })
      .catch((e) => e as ValidationError)

    if (validationResult instanceof ValidationError) {
      return validationResult
    }

    return undefined
  }
}
