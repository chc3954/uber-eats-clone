import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { MutationOutput } from 'src/common/dtos/output.dto';

@InputType()
export class LoginInput extends PickType(User, ['email', 'password']) {}

@ObjectType()
export class LoginOutput extends MutationOutput {
  @Field((type) => String, { nullable: true })
  token?: string;
}
