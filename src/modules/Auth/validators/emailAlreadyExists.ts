import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { User } from '~/modules/Auth/entities/User'

@ValidatorConstraint({ async: true })
export class IsEmailAlreadyExistConstraint implements ValidatorConstraintInterface {
  async validate(email: string) {
    const user = await User.findOne({ where: { email } })
    return !user
  }
}

export const emailAlreadyExist = (validationOptions?: ValidationOptions) => (
  object: Object,
  propertyName: string
) => {
  registerDecorator({
    target: object.constructor,
    propertyName,
    options: {
      message: 'email already in use',
      ...(validationOptions || {}),
    },
    constraints: [],
    validator: IsEmailAlreadyExistConstraint,
  })
}
