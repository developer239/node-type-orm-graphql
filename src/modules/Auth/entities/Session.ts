import { Field, ObjectType } from 'type-graphql'
import { User } from '~/modules/Auth/entities/User'
import { crypto } from '~/modules/Auth/services/crypto'

@ObjectType()
export class Session {
  @Field()
  user: User

  constructor(user: User) {
    this.user = user
  }

  @Field(() => String)
  refreshToken(): Promise<String> {
    return crypto.generateRefreshToken(this.user)
  }

  @Field(() => String)
  accessToken(): String {
    return crypto.generateAccessToken(this.user)
  }
}
