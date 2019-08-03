import { gCall } from '~/test-utils/gCall'
import { createResetPasswordToken, createUser } from '~/modules/Auth/fixtures'

const forgotPasswordQuery = `
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`

const requestForgotPassword = (data: { email: string }) =>
  gCall({
    source: forgotPasswordQuery,
    variableValues: data,
  })

describe('[resolver] Me', () => {
  it('should handle invalid email', async () => {
    const response = await requestForgotPassword({ email: 'invalid-email' })

    expect(response.errors).toBeUndefined()
    expect(response.data.forgotPassword).toEqual(false)
  })

  it('should handle valid email', async () => {
    const user = await createUser()
    await user.save()

    const refreshToken = await createResetPasswordToken(user)
    await refreshToken.save()

    const response = await requestForgotPassword({ email: user.email })

    expect(response.errors).toBeUndefined()
    expect(response.data.forgotPassword).toEqual(true)
  })
})
