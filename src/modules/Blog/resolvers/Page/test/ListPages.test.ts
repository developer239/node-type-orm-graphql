import { createUser } from '~/modules/Auth/fixtures'
import { gCall } from '~/test-utils/gCall'
import { createPage } from '~/modules/Blog/fixtures'

const listPagesQuery = `
  query {
    listPages {
      id
      uri
      title
      text
    }
  }
`

const requestListPages = () =>
  gCall({
    source: listPagesQuery,
  })

describe('[resolver] ListPages', () => {
  it('should return all pages', async () => {
    const user = await createUser()
    await user.save()

    const firstPage = createPage(user)
    const secondPage = createPage(user)
    const thirdPage = createPage(user)

    await Promise.all([firstPage.save(), secondPage.save(), thirdPage.save()])

    const response = await requestListPages()

    expect(response.errors).toBeUndefined()
    expect(response.data.listPages.length).toEqual(3)
  })

  describe('when there are no pages', () => {
    it('should return empty list', async () => {
      const response = await requestListPages()

      expect(response.errors).toBeUndefined()
      expect(response.data.listPages).toEqual([])
    })
  })
})
