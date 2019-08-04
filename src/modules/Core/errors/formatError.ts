import { GraphQLError } from 'graphql'
import { logger } from '~/modules/Core/services/logger'

export const formatError = (error: GraphQLError) => {
  if (error.message === 'Argument Validation Error') {
    logger.apolloValidationError(error.message, error.extensions.exception)
    return {
      message: error.message,
      validationErrors: error.extensions.exception.validationErrors,
    }
  }

  logger.apolloError(error.message, error.extensions.exception.data)
  return new Error(error.message)
}
