import { Page } from '~/modules/Blog/entities/Page'

export const findByUserId = async (userId: number) => {
  const pages = await Page.find({
    relations: ['userConnection'],
    where: { userConnection: { id: userId } },
  })

  if (!pages) {
    return []
  }

  return pages
}
