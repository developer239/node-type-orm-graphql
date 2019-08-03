import { createRefreshToken, createUser } from '~/modules/Auth/fixtures'
import { gCall } from '~/test-utils/gCall'

const accessTokenQuery = `
  query AccessToken($userId: Float!, $refreshToken: String!) {
    accessToken(userId: $userId, refreshToken: $refreshToken)
  }
`

const requestAccessToken = (data: { userId: number; refreshToken: string }) =>
  gCall({
    source: accessTokenQuery,
    variableValues: {
      ...data,
    },
  })

describe('[resolver] AccessToken', () => {
  it('should handle invalid refresh token', async () => {
    const response = await requestAccessToken({ refreshToken: 'invalidToken', userId: 99 })

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
      userId: user.id,
    })

    expect(response.errors).toBeUndefined()
    expect(response.data.accessToken).toBeString()
  })
})
