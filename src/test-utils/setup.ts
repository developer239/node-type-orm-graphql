import { Connection } from 'typeorm'
import { createConnection } from '~/dbConnection'

let connection: Connection

beforeAll(async () => {
  connection = await createConnection()
})

afterAll(async () => {
  await connection.close()
})
