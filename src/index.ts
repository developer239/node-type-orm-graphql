import 'reflect-metadata'
import express from 'express'
import * as bodyParser from 'body-parser'
import { createConnection } from 'typeorm'

const app = express()
app.use(bodyParser.json())

const main = async () => {
  await createConnection()

  app.listen(3000, () => {
    console.log('Started server on port 3000')
  })
}

main()
