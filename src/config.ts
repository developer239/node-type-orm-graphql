import { resolve } from 'path'
import { config as configDotenv } from 'dotenv'
import { parse } from 'pg-connection-string'

/* istanbul ignore next */
const nodeEnv = process.env.NODE_ENV || 'development'

const isTestEnv = ['test', 'circleci'].includes(process.env.NODE_ENV)

configDotenv({
  path: resolve(process.cwd(), `.env.${nodeEnv}`),
})

const pgUrl = process.env.DATABASE_URL ? parse(process.env.DATABASE_URL) : undefined

const config = {
  server: {
    port: parseInt(process.env.PORT!, 10) || 8080,
    maxQueryComplexity: 30,
  },
  database: {
    postgres: {
      ...(pgUrl
        ? {
            host: pgUrl.host,
            port: pgUrl.port,
            username: pgUrl.user,
            password: pgUrl.password,
            databaseName: pgUrl.database,
          }
        : {
            host: process.env.DATABASE_HOST!,
            port: process.env.DATABASE_PORT,
            username: process.env.POSTGRES_USER!,
            password: process.env.POSTGRES_PASSWORD!,
            databaseName: process.env.POSTGRES_DB!,
          }),
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
