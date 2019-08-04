import { createConnection as createTypeOrmConnection } from 'typeorm'
import config from '~/config'

export const createConnection = () =>
  createTypeOrmConnection({
    name: 'default',
    type: 'postgres',
    host: config.database.postgres.host,
    port: Number(config.database.postgres.port),
    username: config.database.postgres.username,
    password: config.database.postgres.password,
    database: config.database.postgres.databaseName,
    synchronize: config.database.postgres.synchronize,
    dropSchema: config.database.postgres.dropSchema,
    logging: config.database.postgres.logging,
    entities: [`${__dirname}/modules/**/**/entities/*.*`],
  })
