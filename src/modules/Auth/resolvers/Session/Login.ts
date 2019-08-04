import { Resolver, Mutation, Arg } from 'type-graphql'
import { crypto } from '~/modules/Auth/services/crypto'
import { Session } from '~/modules/Auth/entities/Session'
import { findByEmail } from '~/modules/Auth/loaders/user'

@Resolver()
export class LoginResolver {
  @Mutation(() => Session)
  async login(@Arg('email') email: string, @Arg('password') password: string): Promise<Session> {
    const user = await findByEmail(email)

    if (!user) {
      throw Error('Invalid credentials')
    }

    const valid = await crypto.comparePasswords(password, user.password)

    if (!valid) {
      throw Error('Invalid credentials')
    }

    return new Session(user)
  }
}
