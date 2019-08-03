import { Length, MinLength } from 'class-validator'
import { Field, InputType } from 'type-graphql'

@InputType()
export class ChangePasswordInput {
  @Field()
  @Length(1, 255)
  token: string

  @Field()
  @MinLength(5)
  password: string
}
