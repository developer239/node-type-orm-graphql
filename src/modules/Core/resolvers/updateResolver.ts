import { Resolver, Mutation, Arg, UseMiddleware, ClassType, Ctx } from 'type-graphql'
import { getConnection } from 'typeorm'
import { Middleware } from 'type-graphql/dist/interfaces/Middleware'
import { IAppContext } from '~/types'

export const updateResolver = <IInputType extends ClassType>(
  entity: any,
  inputType: IInputType,
  middleware?: Middleware<any>[]
) => {
  @Resolver()
  class BaseResolver {
    @Mutation(() => entity, { name: `update${entity.className}` })
    @UseMiddleware(...(middleware || []))
    async create(@Arg('data', () => inputType) data: any, @Ctx() ctx: IAppContext) {
      const { id, ...newData } = data

      const updateResult = await getConnection()
        .createQueryBuilder()
        .update(entity)
        .set(newData)
        .where('id = :id AND userId = :userId', { id, userId: ctx.req.session.userId })
        .returning(['id'])
        .execute()
      const updateFields = updateResult.raw[0]

      if (!updateFields) {
        throw Error('Unauthorized')
      }

      // TODO: I don't want to do separate query for this
      // https://github.com/typeorm/typeorm/issues/2660
      return entity.findOne(updateFields.id)
    }
  }

  return BaseResolver
}
