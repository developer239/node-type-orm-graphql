import { User } from '~/modules/Auth/entities/User'

export const findUserByEmail = (userEmail: string) => User.findOne({ where: { email: userEmail } })

export const findUserById = (userId: number) => User.findOne({ where: { id: userId } })
