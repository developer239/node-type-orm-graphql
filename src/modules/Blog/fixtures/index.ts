import * as R from 'ramda'
import faker from 'faker'
import { User } from '~/modules/Auth/entities/User'
import { Page } from '~/modules/Blog/entities/Page'

export interface IDefaultPage {
  title: string
  text: string
}

export const createPage = (user: User, data?: IDefaultPage) => {
  const page = new Page()
  page.userConnection = user
  page.title = R.prop('title')(data) || faker.lorem.words(4)
  page.text = R.prop('text')(data) || faker.lorem.text()

  return page
}
