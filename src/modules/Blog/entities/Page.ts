import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'
import slugify from 'slugify'
import { User } from '~/modules/Auth/entities/User'

@ObjectType()
@Entity()
export class Page extends BaseEntity {
  static get className() {
    return 'Page'
  }

  static get belongsToUser() {
    return true
  }

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column()
  title: string

  @Field()
  @Column()
  text: string

  @Field()
  @Column()
  uri: string

  @ManyToOne(() => User, user => user.pageConnection, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  userConnection: User

  @Field(() => User, { complexity: 5 })
  user(): Promise<User> {
    return User.findOne({ relations: ['pageConnection'], where: { id: this.userConnection.id } })
  }

  @BeforeInsert()
  buildUri() {
    this.uri = slugify(this.title)
  }
}
