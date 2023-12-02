import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { getDynamoDbClient } from './utils'

export abstract class AbstractRepository {
  dynamoDBClient: DynamoDBDocumentClient
  abstract TABLE_NAME: string

  constructor() {
    this.dynamoDBClient = getDynamoDbClient()
  }
}
