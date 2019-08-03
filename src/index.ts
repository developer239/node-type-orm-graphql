import 'reflect-metadata'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import * as bodyParser from 'body-parser'
import { createSchema } from '~/createSchema'
import { createConnection } from '~/dbConnection'
import config from '~/config'

const app = express()

app.use(bodyParser.json())

const main = async () => {
  await createConnection()

  const apolloServer = new ApolloServer({
    schema: await createSchema(),
    context: ({ req }: any) => ({ req }),
    introspection: true,
    playground: true,
  })

  apolloServer.applyMiddleware({ app, cors: false })

  app.listen(config.server.port, () => {
    console.log(`Started server on port ${config.server.port}`)
  })
}

main()
