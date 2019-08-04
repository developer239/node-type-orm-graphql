import { Resolver, Mutation, Arg } from 'type-graphql'
import { crypto } from '~/modules/Auth/services/crypto'
import { Session } from '~/modules/Auth/entities/Session'
import { findUserByEmail } from '~/modules/Auth/loaders/user'
import { UNAUTHORIZED } from '~/modules/Core/errors'

@Resolver()
export class LoginResolver {
  @Mutation(() => Session)
  async login(@Arg('email') email: string, @Arg('password') password: string): Promise<Session> {
    const user = await findUserByEmail(email)

    if (!user) {
      throw Error(UNAUTHORIZED)
    }

    const valid = await crypto.comparePasswords(password, user.password)

    if (!valid) {
      throw Error(UNAUTHORIZED)
    }

    return new Session(user)
  }
}
