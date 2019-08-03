import 'reflect-metadata'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import * as bodyParser from 'body-parser'
import { createSchema } from '~/createSchema'
import { createConnection } from '~/dbConnection'
import config from '~/config'
import { createComplexityValidator } from '~/plugins/complexityValidator'

const app = express()

app.use(bodyParser.json())

const main = async () => {
  await createConnection()
  const schema = await createSchema()

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }: any) => ({ req }),
    introspection: true,
    playground: true,
    plugins: [createComplexityValidator(schema)],
  })

  apolloServer.applyMiddleware({ app, cors: false })

  app.listen(config.server.port, () => {
    console.log(`Started server on port ${config.server.port}`)
  })
}

main()
