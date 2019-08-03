import slugify from 'slugify'
import { createUser } from '~/modules/Auth/fixtures'
import { gCall } from '~/test-utils/gCall'
import { crypto } from '~/modules/Auth/services/crypto'

const createPageQuery = `
  mutation CreatePage($data: CreatePageInput!) {
    createPage(data: $data) {
      id
      title
      uri
      text
      user {
        id
        email
      }
    }
  }
`

const createPageWithRecursionQuery = `
  mutation CreatePage($data: CreatePageInput!) {
    createPage(data: $data) {
      id
      title
      text
      uri
      user {
        id
        email
        pages {
          id
          title
          text
          uri
          user {
            id
            email
          }
        }
      }
    }
  }
`

const requestCreatePage = (
  data: { title: string; text: string },
  query: string,
  jwtToken?: string
) =>
  gCall({
    source: query,
    variableValues: { data },
    contextValue: {
      req: {
        headers: {
          ...(jwtToken && { authorization: `Bearer ${jwtToken}` }),
        },
      },
    },
  })

describe('[resolver] CreatePage', () => {
  const pageData = {
    title: 'some title',
    text: 'some page text',
  }
  const expectedPageUri = slugify(pageData.title)

  describe('when user is not logged in', () => {
    it('should not create anything', async () => {
      const response = await requestCreatePage(pageData, createPageQuery)

      expect(response.errors).toBeTruthy()
      expect(response.data).toBeNull()
    })
  })

  describe('when user logged in', () => {
    it('create new page', async () => {
      const user = await createUser()
      await user.save()
      const jwtToken = await crypto.generateAccessToken(user)

      const response = await requestCreatePage(pageData, createPageQuery, jwtToken)

      expect(response.errors).toBeUndefined()
      expect(response.data.createPage).toMatchObject({
        ...pageData,
        uri: expectedPageUri,
        user: {
          id: String(user.id),
          email: user.email,
        },
      })
    })

    it('should handle recursive queries', async () => {
      const user = await createUser()
      await user.save()
      const jwtToken = await crypto.generateAccessToken(user)

      const response = await requestCreatePage(pageData, createPageWithRecursionQuery, jwtToken)

      expect(response.errors).toBeUndefined()
      expect(response.data.createPage).toMatchObject({
        ...pageData,
        uri: expectedPageUri,
        user: {
          id: String(user.id),
          email: user.email,
          pages: [
            {
              ...pageData,
              uri: expectedPageUri,
              user: {
                id: String(user.id),
                email: user.email,
              },
            },
          ],
        },
      })
    })
  })
})
