import { resolve } from 'path'
import { config as configDotenv } from 'dotenv'
import { parse } from 'pg-connection-string'

const nodeEnv = process.env.NODE_ENV || 'development'
configDotenv({
  path: resolve(process.cwd(), `.env.${nodeEnv}`),
})

const isTestEnv = ['test', 'circleci'].includes(process.env.NODE_ENV)

const pgUrl = parse(process.env.DATABASE_URL)

const config = {
  server: {
    port: parseInt(process.env.PORT!, 10) || 8080,
    maxQueryComplexity: 30,
  },
  database: {
    postgres: {
      host: pgUrl.host,
      port: pgUrl.port,
      username: pgUrl.user,
      password: pgUrl.password,
      databaseName: pgUrl.database,
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
