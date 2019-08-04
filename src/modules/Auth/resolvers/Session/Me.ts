import { Resolver, Query, Ctx, UseMiddleware } from 'type-graphql'
import { User } from '~/modules/Auth/entities/User'
import { IAppContext } from '~/types'
import { isAuth } from '~/modules/Auth/middlewares/isAuth'
import { findById } from '~/modules/Auth/loaders/user'

@Resolver()
export class Me {
  @UseMiddleware(isAuth)
  @Query(() => User, { nullable: true })
  me(@Ctx() ctx: IAppContext): Promise<User> {
    return findById(ctx.req.session.userId)
  }
}
