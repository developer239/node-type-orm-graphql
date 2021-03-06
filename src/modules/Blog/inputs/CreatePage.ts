import { Length } from 'class-validator'
import { Field, InputType } from 'type-graphql'

@InputType()
export class CreatePageInput {
  @Field()
  @Length(1, 255)
  title: string

  @Field()
  text: string
}
