import { In } from 'typeorm'
import * as R from 'ramda'
import DataLoader from 'dataloader'
import { Page } from '~/modules/Blog/entities/Page'

export const findPagesByUserIds = async (userIds: number[]) => {
  const pages = await Page.find({
    where: { userConnection: { id: In(userIds) } },
  })

  // @ts-ignore
  const groupedPages = R.groupBy(R.prop('userId'))(pages)

  // @ts-ignore
  return R.map(R.propOr([], R.__, groupedPages))(userIds)
}

export const PagesByUserIdsLoader = new DataLoader(findPagesByUserIds)
