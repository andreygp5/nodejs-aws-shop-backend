import { APIGatewayRequestAuthorizerEvent } from 'aws-lambda/trigger/api-gateway-authorizer'
import { getEnvironmentVariables } from '../utils'

export const basicAuthorizer = async (
  event: APIGatewayRequestAuthorizerEvent
) => {
  console.log('basicAuthorizer: ', event)

  const authToken = (event.headers?.['authorization'] || '')?.split(
    'Basic '
  )?.[1]

  if (!authToken) {
    return { isAuthorized: false }
  }

  return {
    isAuthorized:
      atob(authToken) === `andreygp5:${getEnvironmentVariables().andreygp5}`,
  }
}
