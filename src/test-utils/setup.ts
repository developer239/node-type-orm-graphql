import { Connection } from 'typeorm'
import { createConnection } from '~/dbConnection'

const entities = ['user']
const tableNames = entities.map(entity => `"${entity}"`).join(',')

let connection: Connection

beforeAll(async () => {
  try {
    connection = await createConnection()
  } catch (e) {
    console.log('[error] database connection error', e)
  }
})

afterEach(async () => {
  await connection.query(`TRUNCATE TABLE "page" RESTART IDENTITY CASCADE;`)
})

afterAll(async () => {
  await connection.query(`TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE;`)
  await connection.close()
})
