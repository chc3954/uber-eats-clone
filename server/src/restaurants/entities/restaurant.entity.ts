import { Field, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  @Field((type) => Number)
  id: number;

  @Column()
  @Field((type) => String)
  @IsString()
  name: string;

  @Column()
  @Field((type) => Boolean, { defaultValue: false })
  @IsOptional()
  @IsBoolean()
  isVegan: boolean;

  @Column()
  @Field((type) => String)
  @IsString()
  address: string;

  @Column()
  @Field((type) => String)
  @IsString()
  ownersName: string;

  @Column()
  @Field((type) => String)
  @IsString()
  categoryName: string;
}
