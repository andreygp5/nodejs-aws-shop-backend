import { EnvironmentVariables } from '../shared/environment.interfaces'

export const getEnvironmentVariables = (): EnvironmentVariables => {
  return process.env as EnvironmentVariables
}
