import { createUser } from '~/modules/Auth/fixtures'
import { gCall } from '~/test-utils/gCall'
import { crypto } from '~/modules/Auth/services/crypto'
import { createPage } from '~/modules/Blog/fixtures'

const meQuery = `
  query {
    me {
      id
      email
      firstName
      lastName
      pages {
        id
        title
        uri
        text
      }
    }
  }
`

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

describe('[resolver] Me', () => {
  it('should not return anything', async () => {
    const response = await requestMe()

    expect(response.errors).toBeTruthy()
    expect(response.data.me).toBeNull()
  })

  describe('when user logged in', () => {
    it('should return user information', async () => {
      const user = await createUser()
      await user.save()
      const jwtToken = await crypto.generateAccessToken(user)

      const response = await requestMe(jwtToken)

      expect(response.errors).toBeUndefined()
      expect(response.data.me).toMatchObject({
        id: String(user.id),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        pages: [],
      })
    })
  })

  describe('when user has pages', () => {
    it('should return user with pages', async () => {
      const user = await createUser()
      await user.save()

      const firstPage = createPage(user)
      const secondPage = createPage(user)

      const [jwtToken, dbFirstPage, dbSecondPage] = await Promise.all([
        crypto.generateAccessToken(user),
        firstPage.save(),
        secondPage.save(),
      ])

      const response = await requestMe(jwtToken)

      expect(response.errors).toBeUndefined()
      expect(response.data.me).toMatchObject({
        id: String(user.id),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      })
      expect(response.data.me.pages.length).toEqual(2)
      expect(response.data.me.pages[0]).toMatchObject({
        id: String(dbFirstPage.id),
        title: dbFirstPage.title,
        text: dbFirstPage.text,
        uri: dbFirstPage.uri,
      })
      expect(response.data.me.pages[1]).toMatchObject({
        id: String(dbSecondPage.id),
        title: dbSecondPage.title,
        text: dbSecondPage.text,
        uri: dbSecondPage.uri,
      })
    })
  })
})
