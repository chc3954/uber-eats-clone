import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { Dish } from '../entities/dish.entity';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class EditDishInput extends PickType(PartialType(Dish), [
  'name',
  'price',
  'description',
  'options',
  'photo',
]) {
  @Field(() => Number)
  dishId: number;
}

@ObjectType()
export class EditDishOutput extends CoreOutput {}
