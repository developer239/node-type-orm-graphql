import { resolve } from 'path'
import { config as configDotenv } from 'dotenv'

/* istanbul ignore next */
const nodeEnv = process.env.NODE_ENV || 'development'

const isTestEnv = process.env.NODE_ENV === 'test'

configDotenv({
  path: resolve(process.cwd(), `.env.${nodeEnv}`),
})

const config = {
  server: {
    port: parseInt(process.env.PORT!, 10) || 8080,
  },
  database: {
    postgres: {
      port: process.env.DATABASE_PORT,
      host: process.env.DATABASE_HOST!,
      databaseName: process.env.POSTGRES_DB!,
      password: process.env.POSTGRES_PASSWORD!,
      username: process.env.POSTGRES_USER!,
      synchronize: isTestEnv,
      dropSchema: isTestEnv,
    },
  },
  auth: {
    accessTokenSecret: process.env.AUTH_SECRET || 'developmentAuthSecret',
    refreshTokenSecret: process.env.AUTH_SECRET || 'developmentAuthSecret',
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
