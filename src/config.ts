import { resolve } from 'path'
import { config as configDotenv } from 'dotenv'

/* istanbul ignore next */
const nodeEnv = process.env.NODE_ENV || 'development'

configDotenv({
  path: resolve(process.cwd(), `.env.${nodeEnv}`),
})

const config = {
  auth: {
    secret: process.env.AUTH_SECRET || 'developmentAuthSecret',
    createOptions: {
      expiresIn: 60 * 60,
      algorithm: 'HS256',
      issuer: `jwt-issuer`,
    },
    verifyOptions: {
      algorithm: 'HS256',
      issuer: `jwt-issuer`,
    },
  },
}

export default config
