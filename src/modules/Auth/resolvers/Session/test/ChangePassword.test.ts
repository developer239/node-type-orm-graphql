import { DateTime } from 'luxon'
import { gCall } from '~/test-utils/gCall'
import { createResetPasswordToken, createUser } from '~/modules/Auth/fixtures'

const forgotPasswordQuery = `
  mutation ChangePassword($data: ChangePasswordInput!) {
    changePassword(data: $data) {
      user {
        id
        email
        firstName
        lastName
      }
      accessToken
      refreshToken
    }
  }
`

const requestChangePassword = (data: { token: string; password: string }) =>
  gCall({
    source: forgotPasswordQuery,
    variableValues: {
      data,
    },
  })

describe('[resolver] ChangePassword', () => {
  const newPassword = 'new-password'

  it('should handle invalid reset password token', async () => {
    const response = await requestChangePassword({ token: 'invalid-token', password: newPassword })

    expect(response.errors).toBeUndefined()
    expect(response.data.changePassword).toEqual(null)
  })

  it('should handle valid reset password token', async () => {
    const user = await createUser()
    await user.save()

    const expiresAt = DateTime.local().plus({ minutes: 20 })

    const resetPasswordToken = await createResetPasswordToken(user, {
      expires: expiresAt.toJSDate(),
    })
    await resetPasswordToken.save()

    const response = await requestChangePassword({
      token: resetPasswordToken.token,
      password: newPassword,
    })

    expect(response.errors).toBeUndefined()
    expect(response.data.changePassword.user).toEqual({
      id: String(user.id),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    })
    expect(response.data.changePassword.accessToken).toBeString()
    expect(response.data.changePassword.refreshToken).toBeString()
  })

  it('should handle expired reset password token', async () => {
    const user = await createUser()
    await user.save()

    const expiresAt = DateTime.local().minus({ minutes: 20 })

    const resetPasswordToken = await createResetPasswordToken(user, {
      expires: expiresAt.toJSDate(),
    })
    await resetPasswordToken.save()

    const response = await requestChangePassword({
      token: resetPasswordToken.token,
      password: newPassword,
    })

    expect(response.errors).toBeTruthy()
    expect(response.data.changePassword).toBeNull()
  })
})
