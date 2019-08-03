import { Connection } from 'typeorm'
import { createConnection } from '~/dbConnection'

const entities = ['user']
const tableNames = entities.map(entity => `"${entity}"`).join(',')

let connection: Connection

beforeAll(async () => {
  connection = await createConnection()
})

afterAll(async () => {
  await connection.query(`TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE;`)
  await connection.close()
})
