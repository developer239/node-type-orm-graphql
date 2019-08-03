import { createConnection } from 'typeorm'

// TODO: remove ormconfig.json and use this connection function for all environments
export const createTestConnection = () =>
  createConnection({
    name: 'default',
    type: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'root',
    password: 'secretPassword',
    database: 'node_type_orm_graphql',
    synchronize: true,
    dropSchema: true,
    entities: ['src/modules/Auth/**/entities/*.*'],
  })
