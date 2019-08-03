# Node Type ORM GraphQL

## Development

System Dependencies:

1. `brew install node`
2. `brew install yarn`
3. `brew install make`
4. `brew install docker`
5. `brew install docker-compose`

Run docker database:

1. `make infra`
2. `make db-run-migration`

Run node server:

1. `make node_modules`
2. `make watch`

Now you can open [http://localhost:3000/graphql](http://localhost:3000/graphql) in your browser.

### Helpful Commands

- `db-generate-migration name=migration_name` create database migration
- `db-run-migration` apply database migration
- `make db-revert` revert last database migration
- `make db-reset` revert migration and apply it again
- `make test` run tests
- `make test-coverage` run tests and report coverage
- `make lint-ts` run eslint on typescript files
- `make prettier` format source code by prettier