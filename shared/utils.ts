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
