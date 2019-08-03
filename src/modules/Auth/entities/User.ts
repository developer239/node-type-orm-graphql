import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'
import { RefreshToken } from '~/modules/Auth/entities/RefreshToken'

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column()
  firstName: string

  @Field()
  @Column()
  lastName: string

  @Field()
  @Column('text', { unique: true })
  email: string

  @Column()
  password: string

  @OneToMany(() => RefreshToken, refreshToken => refreshToken.user)
  refreshToken: Promise<RefreshToken[]>
}
