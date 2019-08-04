import { Resolver, Arg, Query } from 'type-graphql'
import { User } from '~/modules/Auth/entities/User'
import { RefreshToken } from '~/modules/Auth/entities/RefreshToken'
import { crypto } from '~/modules/Auth/services/crypto'
import { invalidTokenError } from '~/modules/Core/errors'

@Resolver()
export class AccessTokenResolver {
  @Query(() => String)
  async accessToken(
    @Arg('refreshToken') refreshToken: string,
    @Arg('userId') userId: number
  ): Promise<User> {
    const whereCondition = { token: refreshToken, user: { id: userId } }
    const token = await RefreshToken.findOne(whereCondition, { relations: ['user'] })

    if (!token) {
      throw invalidTokenError(whereCondition)
    }

    return crypto.generateAccessToken(token.user)
  }
}
