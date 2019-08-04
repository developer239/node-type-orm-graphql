import { createResolver } from '~/modules/Core/resolvers/createResolver'
import { CreatePageInput } from '~/modules/Blog/inputs/CreatePage'
import { Page } from '~/modules/Blog/entities/Page'
import { isAuth } from '~/modules/Auth/middlewares/isAuth'
import { listResolver } from '~/modules/Core/resolvers/listResolver'

export const createPageResolver = createResolver<typeof CreatePageInput>(Page, CreatePageInput, [
  isAuth,
])

export const listPagesResolver = listResolver(Page)
