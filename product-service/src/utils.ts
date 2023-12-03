import { EnvironmentVariables } from './interfaces'
import { v4 as uuidv4 } from 'uuid'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { ProxyResult } from 'aws-lambda/trigger/api-gateway-proxy'

export const buildResponse = (status: number, body: any): ProxyResult => {
  return {
    statusCode: status,
    body: JSON.stringify(body),
  }
}

export const getErrorBody = ({
  message,
  description,
}: {
  message?: string
  description?: unknown
} = {}) => {
  return {
    message: message || 'Something went wrong',
    ...(description
      ? {
          description:
            description instanceof Error
              ? description.toString()
              : JSON.stringify(description),
        }
      : {}),
  }
}

export const getEnvironmentVariables = (): EnvironmentVariables => {
  return process.env as EnvironmentVariables
}

export const getUniqueId = (): string => {
  return uuidv4()
}

export const getDynamoDbClient = (): DynamoDBDocumentClient => {
  return DynamoDBDocumentClient.from(new DynamoDBClient())
}
