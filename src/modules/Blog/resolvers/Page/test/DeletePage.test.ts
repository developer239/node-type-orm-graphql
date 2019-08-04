import { createUser } from '~/modules/Auth/fixtures'
import { gCall } from '~/test-utils/gCall'
import { createPage } from '~/modules/Blog/fixtures'
import { crypto } from '~/modules/Auth/services/crypto'

const deletePageQuery = `
  mutation DeletePage($id: Float!){
    deletePage(id: $id) {
      id
      user {
        id
      }
    }
  }
`

const requestDeletePage = (id: number, jwtToken?: string) =>
  gCall({
    source: deletePageQuery,
    variableValues: {
      id,
    },
    contextValue: {
      req: {
        headers: {
          ...(jwtToken && { authorization: `Bearer ${jwtToken}` }),
        },
      },
    },
  })

describe('[resolver] deletePage', () => {
  describe('when unauthorized', () => {
    it('should throw an error', async () => {
      const response = await requestDeletePage(99)

      expect(response.errors).toBeTruthy()
      expect(response.data).toBeNull()
    })
  })

  describe('when authorized', () => {
    it('should delete my page', async () => {
      const user = await createUser()
      await user.save()

      const page = createPage(user)
      await page.save()

      const jwtToken = await crypto.generateAccessToken(user)

      const response = await requestDeletePage(page.id, jwtToken)

      expect(response.errors).toBeUndefined()
      expect(response.data.deletePage).toMatchObject({
        id: String(page.id),
        user: {
          id: String(user.id),
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

      const response = await requestDeletePage(othersPage.id, jwtToken)

      expect(response.errors).toBeTruthy()
      expect(response.data).toBeNull()
    })
  })
})
