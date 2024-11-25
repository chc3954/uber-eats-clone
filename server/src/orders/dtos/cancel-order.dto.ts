import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { Order } from '../entities/order.entity';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class CancelOrderInput extends PickType(Order, ['id']) {}

@ObjectType()
export class CancelOrderOutput extends CoreOutput {}
