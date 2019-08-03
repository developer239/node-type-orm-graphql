import util from 'util'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import config from '~/config'
import { RefreshToken } from '~/modules/Auth/entities/RefreshToken'
import { User } from '~/modules/Auth/entities/User'

const jwtSign = util.promisify(jwt.sign) as any

const jwtVerify = util.promisify(jwt.verify) as any

export const crypto = {
  generateAccessToken(user: User) {
    const payload = { userId: user.id }
    return jwtSign(payload, config.auth.accessTokenSecret, config.auth.createOptions)
  },
  async generateRefreshToken(user: User) {
    const payload = { userId: user.id }
    const token: string = await jwtSign(
      payload,
      config.auth.refreshTokenSecret,
      config.auth.createOptions
    )

    const refreshToken = RefreshToken.create({ user, token })
    await refreshToken.save()

    return token
  },
  hashPassword(password: string) {
    return bcrypt.hash(password, 12)
  },
  comparePasswords(plaintext: string, cipherText: string) {
    return bcrypt.compare(plaintext, cipherText)
  },
  async verifyAccessToken(accessToken: string) {
    try {
      // Don't return directly for catch block to work properly
      const data = await jwtVerify(
        accessToken,
        config.auth.accessTokenSecret,
        config.auth.verifyOptions
      )
      return data
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError || err instanceof SyntaxError) {
        return null
      }
      throw err
    }
  },
}
