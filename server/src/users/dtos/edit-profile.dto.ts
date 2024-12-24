import { CoreOutput } from 'src/common/dtos/output.dto';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountInput } from './create-account.dto';

@InputType()
export class EditProfileInput extends PartialType(CreateAccountInput) {
  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  password?: string;
}

@ObjectType()
export class EditProfileOutput extends CoreOutput {}
