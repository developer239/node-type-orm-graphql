import { buildSchema, Query, Resolver } from 'type-graphql'

@Resolver()
class HelloResolver {
  @Query(() => String)
  async helloWorld() {
    return 'Hello World!'
  }
}

export const createSchema = () =>
  buildSchema({
    resolvers: [HelloResolver, `${__dirname}/resolver/*/*.ts`],
  })
