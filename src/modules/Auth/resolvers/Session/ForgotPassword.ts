import { DateTime } from 'luxon'
import { Resolver, Mutation, Arg } from 'type-graphql'
import { v4 } from 'uuid'
import { ResetPasswordToken } from '~/modules/Auth/entities/ResetPasswordToken'
import { sendEmail } from '~/modules/Core/services/mailer'
import { findUserByEmail } from '~/modules/Auth/loaders/user'

@Resolver()
export class ForgotPasswordResolver {
  @Mutation(() => Boolean)
  async forgotPassword(@Arg('email') email: string): Promise<boolean> {
    const user = await findUserByEmail(email)

    if (!user) {
      return false
    }

    const oldResetPasswordToken = await ResetPasswordToken.findOne({ user: { id: user.id } })
    if (oldResetPasswordToken) {
      await oldResetPasswordToken.remove()
    }

    const token = v4()
    const expires = DateTime.local().plus({ minutes: 20 })

    const resetPasswordToken = ResetPasswordToken.create({
      token,
      expires: expires.toString(),
      user: { id: user.id },
    })
    await resetPasswordToken.save()

    const resetPasswordUrl = `http://localhost:3000/user/change-password/${token}`

    await sendEmail({
      from: '"Michal Jarnot" <michal.jarnot@email.com>',
      to: email,
      subject: 'Forgotten Password',
      html: `
      You can use this token to change password: ${token} <br />
      <br />
      <a href="${resetPasswordUrl}">${resetPasswordUrl}</a>
      `,
    })

    return true
  }
}
