import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Restaurant } from './restaurant.entity';

@InputType('CategoryInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Category extends CoreEntity {
  @Column({ unique: true })
  @Field(() => String)
  @IsString()
  name: string;

  @Column({ nullable: true })
  @Field(() => String, {
    nullable: true,
    defaultValue:
      'https://cn-geo1.uber.com/static/mobile-content/eats/cuisine-filters/Deals.png',
  })
  @IsString()
  iconImg?: string;

  @Field(() => [Restaurant])
  @OneToMany(() => Restaurant, (restaurant) => restaurant.category, {
    nullable: true,
    onDelete: 'SET NULL', // If the category is deleted, set the category of the restaurant to null.
  })
  restaurants: Restaurant[];

  @Column({ unique: true })
  @Field(() => String)
  @IsString()
  slug: string;
}
