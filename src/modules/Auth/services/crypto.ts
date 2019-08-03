import util from 'util'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import config from '~/config'

const jwtSign = util.promisify(jwt.sign) as any

const jwtVerify = util.promisify(jwt.verify) as any

export const crypto = {
  generateAccessToken(userId: number) {
    const payload = { userId }
    return jwtSign(payload, config.auth.secret, config.auth.createOptions)
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
      const data = await jwtVerify(accessToken, config.auth.secret, config.auth.verifyOptions)
      return data
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError || err instanceof SyntaxError) {
        return null
      }
      throw err
    }
  },
}
