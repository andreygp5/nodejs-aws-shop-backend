import { EnvironmentVariables } from '../shared/environment.interfaces'
import { v4 as uuidv4 } from 'uuid'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

export const getEnvironmentVariables = (): EnvironmentVariables => {
  return process.env as EnvironmentVariables
}

export const getUniqueId = (): string => {
  return uuidv4()
}

export const getDynamoDbClient = (): DynamoDBDocumentClient => {
  return DynamoDBDocumentClient.from(new DynamoDBClient())
}
