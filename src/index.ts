import 'reflect-metadata'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { ExpressContext } from 'apollo-server-express/src/ApolloServer'
import * as bodyParser from 'body-parser'
import cors from 'cors'
import { createSchema } from '~/createSchema'
import { createConnection } from '~/dbConnection'
import config from '~/config'
import { createComplexityValidator } from '~/plugins/complexityValidator'
import { logger } from '~/modules/Core/services/logger'
import { formatError } from '~/modules/Core/errors/formatError'

const app = express()

app.use(cors())
app.use(bodyParser.json())

const main = async () => {
  await createConnection()
  const schema = await createSchema()

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }: ExpressContext) => ({ req }),
    introspection: true,
    playground: true,
    plugins: [createComplexityValidator(schema)],
    formatError,
  })

  apolloServer.applyMiddleware({ app, cors: false })

  app.listen(config.server.port, () => {
    logger.info(`Started server on port ${config.server.port}`)
  })
}

main()
