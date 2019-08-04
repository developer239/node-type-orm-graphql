import { Connection } from 'typeorm'
import { createConnection } from '~/dbConnection'
import { logger } from '~/modules/Core/services/logger'

const entities = ['user']
const tableNames = entities.map(entity => `"${entity}"`).join(',')

let connection: Connection

beforeAll(async () => {
  try {
    connection = await createConnection()
  } catch (e) {
    logger.error(`Couldn't connect to test database: ${e.message}.`)
  }
})

afterEach(async () => {
  await connection.query(`TRUNCATE TABLE "page" RESTART IDENTITY CASCADE;`)
})

afterAll(async () => {
  await connection.query(`TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE;`)
  await connection.close()
})
