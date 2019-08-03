import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  BeforeInsert,
  ManyToOne,
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
  user: User

  @BeforeInsert()
  buildUri() {
    this.uri = slugify(this.title)
  }
}
