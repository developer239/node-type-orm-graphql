import { Field, ObjectType } from 'type-graphql'
import { User } from '~/modules/Auth/entities/User'

@ObjectType()
export class Session {
  @Field()
  user: User

  @Field()
  refreshToken: string

  @Field()
  accessToken: string
}
