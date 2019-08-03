import { createUser } from '~/modules/Auth/fixtures'
import { gCall } from '~/test-utils/gCall'
import { crypto } from '~/modules/Auth/services/crypto'

const meQuery = `
  query {
    me {
      id
      email
      firstName
      lastName
    }
  }
`

describe('[resolver] Me', () => {
  const requestMe = (jwtToken?: string) =>
    gCall({
      source: meQuery,
      contextValue: {
        req: {
          headers: {
            ...(jwtToken && { authorization: `Bearer ${jwtToken}` }),
          },
        },
      },
    })

  it('should not return anything', async () => {
    const response = await requestMe()

    expect(response.errors).toBeTruthy()
    expect(response.data.me).toBeNull()
  })

  describe('when user logged in', () => {
    it('should return user information', async () => {
      const user = await createUser()
      const dbUser = await user.save()
      const jwtToken = await crypto.generateAccessToken(dbUser)

      const response = await requestMe(jwtToken)

      expect(response.errors).toBeUndefined()
      expect(response.data.me).toEqual({
        id: String(dbUser.id),
        email: dbUser.email,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
      })
    })
  })
})
