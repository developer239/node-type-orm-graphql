import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { getCustomRepository } from 'typeorm'
import { UserRepository } from '~/modules/Auth/repositories/UserRepository'

@ValidatorConstraint({ async: true })
export class IsEmailAlreadyExistConstraint implements ValidatorConstraintInterface {
  async validate(email: string) {
    const userRepository = getCustomRepository(UserRepository)
    const user = await userRepository.findByEmail(email)

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
