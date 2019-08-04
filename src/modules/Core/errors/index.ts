import Boom from 'boom'

export const unauthorizedError = (data?: any) => Boom.badData('Access denied', data)

export const tokenExpiredError = (data?: any) => Boom.badData('Token Expired', data)

export const invalidTokenError = (data?: any) => Boom.badData('Invalid Token', data)

export const notFoundError = (data?: any) => Boom.badData('Not Found', data)
