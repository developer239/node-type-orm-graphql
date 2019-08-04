import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { findByEmail } from '~/modules/Auth/loaders/user'

@ValidatorConstraint({ async: true })
export class IsEmailAlreadyExistConstraint implements ValidatorConstraintInterface {
  async validate(email: string) {
    const user = await findByEmail(email)

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
