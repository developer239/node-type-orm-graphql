import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'
import { RefreshToken } from '~/modules/Auth/entities/RefreshToken'
import { Page } from '~/modules/Blog/entities/Page'
import { PagesByUserIdsLoader } from '~/modules/Blog/loaders/page'

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

  @Field(() => [Page], { nullable: true, complexity: 5 })
  async pages(): Promise<Page[] | []> {
    const pages = (PagesByUserIdsLoader.load(this.id) as unknown) as Page[]

    return pages
  }
}
