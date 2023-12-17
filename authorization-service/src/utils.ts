import { EnvironmentVariables } from './interfaces'

export const getEnvironmentVariables = (): EnvironmentVariables => {
  return process.env as EnvironmentVariables
}
