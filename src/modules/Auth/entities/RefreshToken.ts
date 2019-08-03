import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'
import { User } from '~/modules/Auth/entities/User'

@ObjectType()
@Entity()
export class RefreshToken extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column()
  token: string

  @ManyToOne(() => User, user => user.refreshTokens, {
    onDelete: 'CASCADE',
  })
  user: User
}
