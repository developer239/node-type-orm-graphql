import { User } from '~/modules/Auth/entities/User'

export const findByEmail = (userEmail: string) => User.findOne({ where: { email: userEmail } })

export const findById = (userId: number) => User.findOne({ where: { id: userId } })
