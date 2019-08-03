import { EntityRepository, Repository } from 'typeorm'
import { User } from '~/modules/Auth/entities/User'

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  findByEmail(email: string) {
    return User.findOne({ where: { email } })
  }
}
