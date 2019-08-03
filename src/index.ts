import 'reflect-metadata'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import * as bodyParser from 'body-parser'
import { createConnection } from 'typeorm'
import { createSchema } from '~/createSchema'

const app = express()

app.use(bodyParser.json())

const main = async () => {
  await createConnection()

  const apolloServer = new ApolloServer({
    schema: await createSchema(),
    context: ({ req, res }: any) => ({ req, res }),
  })

  apolloServer.applyMiddleware({ app })

  app.listen(3000, () => {
    console.log('Started server on port 3000')
  })
}

main()
