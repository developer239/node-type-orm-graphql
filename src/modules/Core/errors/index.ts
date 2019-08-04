import Boom from 'boom'

export const unauthorizedError = (data?: Object) => Boom.badData('Access denied', data)

export const tokenExpiredError = (data?: Object) => Boom.badData('Token Expired', data)

export const invalidTokenError = (data?: Object) => Boom.badData('Invalid Token', data)

export const notFoundError = (data?: Object) => Boom.badData('Not Found', data)
