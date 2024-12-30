import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { Category } from './category.entity';
import { User } from 'src/users/entities/user.entity';
import { Dish } from './dish.entity';
import { Order } from 'src/orders/entities/order.entity';

@InputType('RestaurantInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {
  @Column()
  @Field(() => String)
  @IsString()
  name: string;

  @Column()
  @Field(() => String)
  @IsString()
  coverImg: string;

  @Column()
  @Field(() => String)
  @IsString()
  address: string;

  @Field(() => Category, { nullable: true })
  @ManyToOne(() => Category, (category) => category.restaurants, {
    nullable: true,
    onDelete: 'SET NULL', // If the category is deleted, set the category of the restaurant to null.
    eager: true,
  })
  category: Category;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.restaurants, {
    onDelete: 'CASCADE', // If the user is deleted, delete the restaurant.
  })
  owner: User;

  // This is a virtual field
  @RelationId((restaurant: Restaurant) => restaurant.owner)
  ownerId: number;

  @Field(() => [Dish], { nullable: true })
  @OneToMany(() => Dish, (dish) => dish.restaurant)
  menu?: Dish[];

  @Field(() => [Order])
  @OneToMany(() => Order, (order) => order.restaurant)
  orders: Order[];

  @Field(() => Boolean)
  @Column({ default: false })
  isPromoted: boolean;

  @Field(() => Date, { nullable: true })
  @Column({ nullable: true })
  promotedUntil?: Date;
}
