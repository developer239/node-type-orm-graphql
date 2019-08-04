import { Resolver, Mutation, Arg, UseMiddleware, ClassType, Ctx } from 'type-graphql'
import { getConnection } from 'typeorm'
import { Middleware } from 'type-graphql/dist/interfaces/Middleware'
import { IAppContext } from '~/types'
import { unauthorizedError } from '~/modules/Core/errors'

// TODO: I want to do this in one query
// https://github.com/typeorm/typeorm/issues/2660
export const updateResolver = <IInputType extends ClassType>(
  entity: any,
  inputType: IInputType,
  middleware?: Middleware<any>[]
) => {
  @Resolver()
  class BaseResolver {
    @Mutation(() => entity, { name: `update${entity.className}` })
    @UseMiddleware(...(middleware || []))
    async update(@Arg('data', () => inputType) data: any, @Ctx() ctx: IAppContext) {
      const { id, ...newData } = data
      const updateWhere = { id, userId: ctx.req.session.userId }

      const updateResult = await getConnection()
        .createQueryBuilder()
        .update(entity)
        .set(newData)
        .where('id = :id AND userId = :userId', updateWhere)
        .returning(['id'])
        .execute()
      const updateFields = updateResult.raw[0]

      if (!updateFields) {
        throw unauthorizedError({
          data,
          session: ctx.req.session,
          mutationName: `update${entity.className}`,
        })
      }

      return entity.findOne(updateFields.id)
    }
  }

  return BaseResolver
}
