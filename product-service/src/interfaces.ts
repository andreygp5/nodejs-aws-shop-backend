export interface EnvironmentVariables extends Record<string, string> {
  PRODUCT_TABLE_NAME: string
  STOCK_TABLE_NAME: string
  CREATE_PRODUCT_TOPIC_ARN: string
}
