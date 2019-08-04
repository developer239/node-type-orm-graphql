import { Page } from '~/modules/Blog/entities/Page'

export const findPagesByUserId = async (userId: number) => {
  const pages = await Page.find({
    where: { userConnection: { id: userId } },
  })

  if (!pages) {
    return []
  }

  return pages
}
