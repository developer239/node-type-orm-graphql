import { createUser } from '~/modules/Auth/fixtures'
import { gCall } from '~/test-utils/gCall'
import { createPage } from '~/modules/Blog/fixtures'

const pageDetailQuery = `
  query PageDetail($id: Float!){
    pageDetail(id: $id) {
      id
      title
      text
    }
  }
`

const requestPageDetail = (id: number) =>
  gCall({
    source: pageDetailQuery,
    variableValues: { id },
  })

describe('[resolver] ListPages', () => {
  it('should return existing page', async () => {
    const user = await createUser()
    await user.save()

    const page = createPage(user)
    await page.save()

    const response = await requestPageDetail(page.id)

    expect(response.errors).toBeUndefined()
    expect(response.data.pageDetail).toMatchObject({
      id: String(page.id),
      title: page.title,
      text: page.text,
    })
  })

  describe('when page does not exist', () => {
    it('should return error', async () => {
      const response = await requestPageDetail(99)

      expect(response.errors).toBeTruthy()
      expect(response.data).toEqual(null)
    })
  })
})
