import { createUser } from '~/modules/Auth/fixtures'
import { gCall } from '~/test-utils/gCall'

const registerMutation = `
  mutation Register($data: RegisterInput!) {
    register(
      data: $data
    ) {
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

describe('[resolver] Register', () => {
  it('should create resolver', async () => {
    const user = await createUser()

    const response = await gCall({
      source: registerMutation,
      variableValues: {
        data: user,
      },
    })

    expect(response.errors).toBeUndefined()
    expect(response.data.register.accessToken).toBeString()
    expect(response.data.register.refreshToken).toBeString()
    expect(response.data.register.user).toMatchObject({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    })
  })
})
