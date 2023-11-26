import { PutCommand, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'
import { getEnvironmentVariables } from '../utils'
import { AbstractRepository } from '../abstract-repository'
import { StockTable } from './stock.model'

export class StockRepository extends AbstractRepository {
  TABLE_NAME = getEnvironmentVariables().STOCK_TABLE_NAME

  public async getAllStocks(): Promise<StockTable[]> {
    return (
      await this.dynamoDBClient.send(
        new ScanCommand({
          TableName: this.TABLE_NAME,
        })
      )
    )?.Items as StockTable[]
  }

  public async getStockById(productId: string): Promise<StockTable> {
    return (
      await this.dynamoDBClient.send(
        new QueryCommand({
          TableName: this.TABLE_NAME,
          KeyConditionExpression: 'product_id = :product_id',
          ExpressionAttributeValues: {
            ':product_id': productId,
          },
        })
      )
    )?.Items?.[0] as StockTable
  }

  public async createStock(stock: StockTable): Promise<void> {
    await this.dynamoDBClient.send(
      new PutCommand({
        TableName: this.TABLE_NAME,
        Item: stock,
      })
    )
  }
}
