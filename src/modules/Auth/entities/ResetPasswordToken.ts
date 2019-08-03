import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn } from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'
import { User } from '~/modules/Auth/entities/User'

@ObjectType()
@Entity()
export class ResetPasswordToken extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column()
  token: string

  @Field()
  @Column()
  expires: Date

  @OneToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User
}
