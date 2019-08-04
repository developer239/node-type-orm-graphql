import { getComplexity, simpleEstimator, fieldConfigEstimator } from 'graphql-query-complexity'
import { GraphQLSchema, separateOperations } from 'graphql'
import config from '~/config'
import { logger } from '~/modules/Core/services/logger'

export const createComplexityValidator = (schema: GraphQLSchema) => ({
  requestDidStart: () => ({
    didResolveOperation({ request, document }: any) {
      const complexity = getComplexity({
        schema,
        query: request.operationName
          ? separateOperations(document)[request.operationName]
          : document,
        variables: request.variables,
        estimators: [fieldConfigEstimator(), simpleEstimator({ defaultComplexity: 1 })],
      })

      if (complexity >= config.server.maxQueryComplexity) {
        throw new Error(
          `Query is too complex: ${complexity}. Maximum allowed complexity: ${config.server.maxQueryComplexity}`
        )
      }

      // This condition will prevent our console from being spammed by apollo playground introspection queries
      if (request.operationName !== 'IntrospectionQuery') {
        logger.error(`Used query complexity points: ${complexity}`)
      }
    },
  }),
})
