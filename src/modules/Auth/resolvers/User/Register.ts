import { Resolver, Mutation, Arg } from 'type-graphql'
import { User } from '~/modules/Auth/entities/User'
import { RegisterInput } from '~/modules/Auth/inputs/Register'
import { crypto } from '~/modules/Auth/services/crypto'
import { Session } from '~/modules/Auth/entities/Session'

@Resolver()
export class RegisterResolver {
  @Mutation(() => Session)
  async register(@Arg('data') data: RegisterInput): Promise<Session> {
    const hashedPassword = await crypto.hashPassword(data.password)

    const user = await User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPassword,
    })

    await user.save()

    return new Session(user)
  }
}
