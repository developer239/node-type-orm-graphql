import { Resolver, Arg, Query } from 'type-graphql'
import { User } from '~/modules/Auth/entities/User'
import { RefreshToken } from '~/modules/Auth/entities/RefreshToken'
import { crypto } from '~/modules/Auth/services/crypto'
import { INVALID_TOKEN } from '~/modules/Core/errors'

@Resolver()
export class AccessTokenResolver {
  @Query(() => String)
  async accessToken(
    @Arg('refreshToken') refreshToken: string,
    @Arg('userId') userId: number
  ): Promise<User> {
    const token = await RefreshToken.findOne(
      { token: refreshToken, user: { id: userId } },
      { relations: ['user'] }
    )

    if (!token) {
      throw Error(INVALID_TOKEN)
    }

    return crypto.generateAccessToken(token.user)
  }
}
