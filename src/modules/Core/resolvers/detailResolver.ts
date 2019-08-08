import { Resolver, UseMiddleware, Query, Arg } from 'type-graphql'
import { Middleware } from 'type-graphql/dist/interfaces/Middleware'

const firstLetterToLowerCase = (word: string) => `${word.charAt(0).toLowerCase()}${word.slice(1)}`

export const detailResolver = (entity: any, middleware?: Middleware<any>[]) => {
  @Resolver()
  class BaseResolver {
    @Query(() => entity, { name: `${firstLetterToLowerCase(entity.className)}Detail` })
    @UseMiddleware(...(middleware || []))
    async detail(@Arg('id', () => Number) id: number) {
      return entity.findOneOrFail(id)
    }
  }

  return BaseResolver
}
