import { DateTime } from 'luxon'
import { Resolver, Mutation, Arg } from 'type-graphql'
import { getConnection } from 'typeorm'
import { User } from '~/modules/Auth/entities/User'
import { ChangePasswordInput } from '~/modules/Auth/inputs/ChangePassword'
import { ResetPasswordToken } from '~/modules/Auth/entities/ResetPasswordToken'
import { crypto } from '~/modules/Auth/services/crypto'
import { Session } from '~/modules/Auth/entities/Session'

@Resolver()
export class ChangePasswordResolver {
  @Mutation(() => Session, { nullable: true })
  async changePassword(@Arg('data') data: ChangePasswordInput): Promise<Session | null> {
    const resetPasswordToken = await ResetPasswordToken.findOne({
      where: { token: data.token },
      relations: ['user'],
    })

    if (!resetPasswordToken) {
      return null
    }

    const expiresAt = DateTime.fromJSDate(resetPasswordToken.expires)
    const now = DateTime.fromJSDate(new Date())

    if (now.toSeconds() > expiresAt.toSeconds()) {
      await resetPasswordToken.remove()
      throw Error('Reset password token is expired')
    }

    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ password: await crypto.hashPassword(data.password) })
      .where('id = :id', { id: resetPasswordToken.user.id })
      .execute()

    await resetPasswordToken.remove()

    const user = resetPasswordToken.user

    return {
      user,
      accessToken: crypto.generateAccessToken(user),
      refreshToken: await crypto.generateRefreshToken(user),
    }
  }
}
