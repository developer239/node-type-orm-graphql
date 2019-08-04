import { createUser } from '~/modules/Auth/fixtures'
import { gCall } from '~/test-utils/gCall'
import { createPage } from '~/modules/Blog/fixtures'
import { crypto } from '~/modules/Auth/services/crypto'

const updatePageQuery = `
  mutation UpdatePage($data: UpdatePageInput!) {
    updatePage(data: $data) {
      id
      uri
      title
      text
      user {
        id
        email
      }
    }
  }
`

const requestUpdatePage = (data: { id: number; title: string; text: string }, jwtToken?: string) =>
  gCall({
    source: updatePageQuery,
    variableValues: {
      data,
    },
    contextValue: {
      req: {
        headers: {
          ...(jwtToken && { authorization: `Bearer ${jwtToken}` }),
        },
      },
    },
  })

describe('[resolver] updatePage', () => {
  const newPageData = {
    title: 'new title',
    text: 'new text',
  }

  describe('when unauthorized', () => {
    it('should throw an error', async () => {
      const response = await requestUpdatePage({ id: 99, ...newPageData })

      expect(response.errors).toBeTruthy()
      expect(response.data).toBeNull()
    })
  })

  describe('when authorized', () => {
    it('should update my page', async () => {
      const user = await createUser()
      await user.save()

      const page = createPage(user)
      await page.save()

      const jwtToken = await crypto.generateAccessToken(user)

      const response = await requestUpdatePage({ id: page.id, ...newPageData }, jwtToken)

      expect(response.errors).toBeUndefined()
      expect(response.data.updatePage).toEqual({
        id: String(page.id),
        uri: page.uri,
        ...newPageData,
        user: {
          id: String(user.id),
          email: user.email,
        },
      })
    })

    it("should NOT update other people's pages", async () => {
      const me = await createUser()
      await me.save()

      const otherUser = await createUser()
      await otherUser.save()

      const othersPage = createPage(otherUser)
      await othersPage.save()

      const jwtToken = await crypto.generateAccessToken(me)

      const response = await requestUpdatePage({ id: othersPage.id, ...newPageData }, jwtToken)

      expect(response.errors).toBeTruthy()
      expect(response.data).toBeNull()
    })
  })
})
