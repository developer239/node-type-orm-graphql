import { Resolver, Mutation, Arg, UseMiddleware, ClassType, Ctx } from 'type-graphql'
import { Middleware } from 'type-graphql/dist/interfaces/Middleware'
import { IAppContext } from '~/types'

export const createResolver = <IInputType extends ClassType>(
  entity: any,
  inputType: IInputType,
  middleware?: Middleware<any>[]
) => {
  @Resolver()
  class BaseResolver {
    @Mutation(() => entity, { name: `create${entity.className}` })
    @UseMiddleware(...(middleware || []))
    create(@Arg('data', () => inputType) data: any, @Ctx() ctx: IAppContext) {
      if (entity.belongsToUser) {
        return entity
          .create({
            ...data,
            userConnection: { id: ctx.req.session.userId },
          })
          .save()
      }

      return entity.create(data).save()
    }
  }

  return BaseResolver
}
