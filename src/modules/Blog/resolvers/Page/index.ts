import { createResolver } from '~/modules/Core/resolvers/createResolver'
import { CreatePageInput } from '~/modules/Blog/inputs/CreatePage'
import { Page } from '~/modules/Blog/entities/Page'
import { isAuth } from '~/modules/Auth/middlewares/isAuth'
import { listResolver } from '~/modules/Core/resolvers/listResolver'
import { updateResolver } from '~/modules/Core/resolvers/updateResolver'
import { UpdatePageInput } from '~/modules/Blog/inputs/UpdatePage'
import { deleteResolver } from '~/modules/Core/resolvers/deleteResolver'

export const createPageResolver = createResolver<typeof CreatePageInput>(Page, CreatePageInput, [
  isAuth,
])

export const updatePageResolver = updateResolver<typeof UpdatePageInput>(Page, UpdatePageInput, [
  isAuth,
])

export const deletePageResolver = deleteResolver(Page, [isAuth])

export const listPagesResolver = listResolver(Page)
