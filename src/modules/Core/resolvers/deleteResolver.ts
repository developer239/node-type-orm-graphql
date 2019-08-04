import { Resolver, Mutation, Arg, UseMiddleware, Ctx } from 'type-graphql'
import { Middleware } from 'type-graphql/dist/interfaces/Middleware'
import { IAppContext } from '~/types'

export const deleteResolver = (entity: any, middleware?: Middleware<any>[]) => {
  @Resolver()
  class BaseResolver {
    @Mutation(() => entity, { name: `delete${entity.className}` })
    @UseMiddleware(...(middleware || []))
    async create(@Arg('id', () => Number) id: number, @Ctx() ctx: IAppContext) {
      const entityInstance = await entity.findOne(id)

      if (!entityInstance) {
        throw Error('Not found')
      }

      if (entity.belongsToUser && entityInstance.userId !== ctx.req.session.userId) {
        throw Error('Unauthorized')
      }

      entityInstance.remove()

      return entityInstance
    }
  }

  return BaseResolver
}
