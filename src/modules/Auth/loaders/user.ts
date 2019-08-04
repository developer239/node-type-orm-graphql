import DataLoader from 'dataloader'
import { In } from 'typeorm'
import { User } from '~/modules/Auth/entities/User'

export const usersByIds = (userId: number[]) => User.find({ where: { id: In(userId) } })

export const UsersLoader = new DataLoader(usersByIds)

export const findUserById = (userId: number) => UsersLoader.load(userId)

export const findUserByEmail = (userEmail: string) => User.findOne({ where: { email: userEmail } })
