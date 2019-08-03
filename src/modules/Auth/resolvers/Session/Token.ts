import { Resolver, Arg, Mutation } from 'type-graphql'
import { User } from '~/modules/Auth/entities/User'
import { RefreshToken } from '~/modules/Auth/entities/RefreshToken'
import { crypto } from '~/modules/Auth/services/crypto'

@Resolver()
export class TokenResolver {
  @Mutation(() => String)
  async token(
    @Arg('refreshToken') refreshToken: string,
    @Arg('userId') userId: number
  ): Promise<User> {
    const token = await RefreshToken.findOne({ token: refreshToken, user: { id: userId } })

    if (!token) {
      throw Error('invalid refresh token')
    }

    return crypto.generateAccessToken(userId)
  }
}
