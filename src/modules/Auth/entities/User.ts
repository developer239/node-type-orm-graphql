import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'
import { crypto } from '~/modules/Auth/services/crypto'
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

  @Field(() => String)
  accessToken(): string {
    return crypto.generateAccessToken(this.id)
  }

  @OneToMany(() => RefreshToken, refreshToken => refreshToken.user)
  refreshTokenConnection: Promise<RefreshToken[]>

  @Field(() => String)
  async refreshToken(): Promise<string> {
    const token: string = await crypto.generateRefreshToken(this.id)

    const refreshToken = RefreshToken.create({ user: this, token })
    await refreshToken.save()

    return token
  }
}
