import { createResolver } from '~/modules/Core/resolvers/createResolver'
import { Page } from '~/modules/Blog/entities/Page'
import { CreatePageInput } from '~/modules/Blog/inputs/CreatePage'
import { isAuth } from '~/modules/Auth/middlewares/isAuth'

export const createPageResolver = createResolver<typeof CreatePageInput>(Page, CreatePageInput, [
  isAuth,
])
