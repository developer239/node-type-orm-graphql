import { createUser, FAKE_PASSWORD } from '~/modules/Auth/fixtures'
import { gCall } from '~/test-utils/gCall'

const meQuery = `
  mutation Login($email: String!, $password: String!) {
    login(
      email: $email
      password: $password
    ) {
      user {
        id
        firstName
        lastName
        email
      }
      accessToken
      refreshToken
    }
  }
`

const requestLogin = (variables: { email: string; password: string }) =>
  gCall({
    source: meQuery,
    variableValues: {
      ...variables,
    },
  })

describe('[resolver] Login', () => {
  describe('when user does NOT exist', () => {
    it('should not return anything', async () => {
      const user = await createUser()
      const response = await requestLogin({ email: user.email, password: FAKE_PASSWORD })

      expect(response.errors[0].message).toEqual('Invalid credentials')
    })
  })

  describe('when user exists', () => {
    it('should handle invalid credentials', async () => {
      const user = await createUser()
      await user.save()

      const response = await requestLogin({ email: user.email, password: 'wrong password' })

      expect(response.errors[0].message).toEqual('Invalid credentials')
    })

    it('should handle valid credentials', async () => {
      const user = await createUser()
      await user.save()

      const response = await requestLogin({ email: user.email, password: FAKE_PASSWORD })

      expect(response.errors).toBeUndefined()
      expect(response.data.login.user).toEqual({
        id: String(user.id),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      })
    })
  })
})
