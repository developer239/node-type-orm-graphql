// eslint-disable-next-line
const config = require('./lib/config')

module.exports = {
  name: 'default',
  type: 'postgres',
  host: config.default.database.postgres.host,
  port: Number(config.default.database.postgres.port),
  username: config.default.database.postgres.username,
  password: config.default.database.postgres.password,
  database: config.default.database.postgres.databaseName,
  synchronize: config.default.database.postgres.synchronize,
  dropSchema: config.default.database.postgres.dropSchema,
  migrationsTableName: 'migration_table',
  migrations: ['src/migration/*.ts'],
  cli: { migrationsDir: 'src/migration' },
  entities: ['src/modules/**/**/entities/*.*'],
}
