import { createUser } from '~/modules/Auth/fixtures'
import { gCall } from '~/test-utils/gCall'

const registerMutation = `
  mutation Register($data: RegisterInput!) {
    register(
      data: $data
    ) {
      id
      email
      firstName
      lastName
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

    expect(response.errors).toEqual(undefined)
    expect(response).toMatchObject({
      data: {
        register: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      },
    })
  })
})
