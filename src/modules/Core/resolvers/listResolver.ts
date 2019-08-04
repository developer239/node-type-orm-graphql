import { Resolver, UseMiddleware, Query } from 'type-graphql'
import { Middleware } from 'type-graphql/dist/interfaces/Middleware'
import pluralize from 'pluralize'

export const listResolver = (entity: any, middleware?: Middleware<any>[]) => {
  @Resolver()
  class BaseResolver {
    @Query(() => [entity], { name: `list${pluralize(entity.className)}` })
    @UseMiddleware(...(middleware || []))
    list() {
      return entity.find()
    }
  }

  return BaseResolver
}
