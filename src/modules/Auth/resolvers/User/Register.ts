import { Resolver, Mutation, Arg } from 'type-graphql'
import bcrypt from 'bcryptjs'
import { User } from '~/modules/Auth/entities/User'
import { RegisterInput } from '~/modules/Auth/inputs/Register'

@Resolver()
export class RegisterResolver {
  @Mutation(() => User)
  async register(@Arg('data') data: RegisterInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 12)

    const user = await User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPassword,
    })

    await user.save()

    return user
  }
}
