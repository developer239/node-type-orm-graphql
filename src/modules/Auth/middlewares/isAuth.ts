import { MiddlewareFn } from 'type-graphql'
import { IAppContext } from '~/types'
import { crypto } from '~/modules/Auth/services/crypto'
import { findById } from '~/modules/Auth/loaders/user'

export const isAuth: MiddlewareFn<IAppContext> = async ({ context }, next) => {
  if (!context.req.headers.authorization) {
    throw new Error('not authenticated')
  }

  const token = context.req.headers.authorization.split(' ')[1]
  const jwtPayload = await crypto.verifyAccessToken(token)

  const now = Date.now()
  if (!jwtPayload || !jwtPayload.exp || now >= jwtPayload.exp * 1000) {
    throw Error('token expired')
  }

  const userId = parseInt(jwtPayload.userId, 10)
  const user = await findById(userId)

  if (!user) {
    throw Error('invalid credentials')
  }

  context.req.session = {
    userId,
  }

  return next()
}
