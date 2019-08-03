import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'
import { RefreshToken } from '~/modules/Auth/entities/RefreshToken'
import { Page } from '~/modules/Blog/entities/Page'

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
  refreshTokens: Promise<RefreshToken[]>

  @OneToMany(() => Page, page => page.userConnection)
  pageConnection: Promise<Page[]>

  @Field(() => [Page], { nullable: true })
  async pages(): Promise<Page[] | []> {
    const pages = await Page.find({
      relations: ['userConnection'],
      where: { userConnection: { id: this.id } },
    })

    if (!pages) {
      return []
    }

    return pages
  }
}
