import { Resolver, Mutation, Arg } from 'type-graphql'
import { getCustomRepository } from 'typeorm'
import { crypto } from '~/modules/Auth/services/crypto'
import { Session } from '~/modules/Auth/entities/Session'
import { UserRepository } from '~/modules/Auth/repositories/UserRepository'

@Resolver()
export class LoginResolver {
  @Mutation(() => Session)
  async login(@Arg('email') email: string, @Arg('password') password: string): Promise<Session> {
    const userRepository = getCustomRepository(UserRepository)
    const user = await userRepository.findByEmail(email)

    if (!user) {
      throw Error('Invalid credentials')
    }

    const valid = await crypto.comparePasswords(password, user.password)

    if (!valid) {
      throw Error('Invalid credentials')
    }

    return {
      user,
      accessToken: crypto.generateAccessToken(user),
      refreshToken: await crypto.generateRefreshToken(user),
    }
  }
}
