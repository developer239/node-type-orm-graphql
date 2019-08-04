import DataLoader from 'dataloader'
import { In } from 'typeorm'
import { User } from '~/modules/Auth/entities/User'

export const findUserByEmail = (userEmail: string) => User.findOne({ where: { email: userEmail } })

export const findUserById = (userId: number) => User.findOne({ where: { id: userId } })

export const findUsersByIds = (userId: number[]) => User.find({ where: { id: In(userId) } })

export const UsersLoader = new DataLoader(findUsersByIds)
