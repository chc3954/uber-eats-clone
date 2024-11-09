import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Category } from './category.entity';
import { User } from 'src/users/entities/user.entity';

@InputType('RestaurantInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {
  @Column()
  @Field((type) => String)
  @IsString()
  name: string;

  @Field((type) => String)
  @Column()
  @IsString()
  coverImg: string;

  @Column()
  @Field((type) => String)
  @IsString()
  address: string;

  @Field((type) => Category, { nullable: true })
  @ManyToOne((type) => Category, (category) => category.restaurants, {
    nullable: true,
    onDelete: 'SET NULL', // If the category is deleted, set the category of the restaurant to null.
  })
  category: Category;

  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.restaurants, {
    onDelete: 'CASCADE', // If the user is deleted, delete the restaurant.
  })
  owner: User;

  // This is a virtual field
  @RelationId((restaurant: Restaurant) => restaurant.owner)
  ownerId: number;
}
