import { createRefreshToken, createUser } from '~/modules/Auth/fixtures'
import { gCall } from '~/test-utils/gCall'

const accessTokenQuery = `
  query AccessToken($refreshToken: String!) {
    accessToken(refreshToken: $refreshToken)
  }
`

const requestAccessToken = (data: { refreshToken: string }) =>
  gCall({
    source: accessTokenQuery,
    variableValues: {
      ...data,
    },
  })

describe('[resolver] AccessToken', () => {
  it('should handle invalid refresh token', async () => {
    const response = await requestAccessToken({ refreshToken: 'invalidToken' })

    expect(response.errors).toBeTruthy()
    expect(response.data).toBeNull()
  })

  it('should handle valid refresh token', async () => {
    const user = await createUser()
    await user.save()

    const refreshToken = await createRefreshToken(user)
    await refreshToken.save()

    const response = await requestAccessToken({
      refreshToken: refreshToken.token,
    })

    expect(response.errors).toBeUndefined()
    expect(response.data.accessToken).toBeString()
  })
})
