import { Length, IsEmail } from 'class-validator'
import { Field, InputType } from 'type-graphql'
import { emailAlreadyExist } from '~/modules/Auth/validators/emailAlreadyExists'

@InputType()
export class RegisterInput {
  @Field()
  @Length(1, 255)
  firstName: string

  @Field()
  @Length(1, 255)
  lastName: string

  @Field()
  @IsEmail()
  @emailAlreadyExist()
  email: string

  @Field()
  password: string
}
