import { Connection } from 'typeorm'
import { createTestConnection } from './testConnection'

let connection: Connection

beforeAll(async () => {
  connection = await createTestConnection()
})

afterAll(async () => {
  await connection.close()
})
