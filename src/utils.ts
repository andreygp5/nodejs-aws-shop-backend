import { ProxyResult } from "aws-lambda/trigger/api-gateway-proxy";

export const buildResponse = (status: number, body: any): ProxyResult => {
  return {
    statusCode: status,
    body: JSON.stringify(body),
  };
};
