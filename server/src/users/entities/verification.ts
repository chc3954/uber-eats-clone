import { CoreEntity } from 'src/common/entities/core.entity';
import {
  BeforeUpdate,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { User } from './user.entity';
import { v4 as uuidv4 } from 'uuid';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Verification extends CoreEntity {
  @Column()
  @Field((type) => String)
  code: string;

  @OneToOne((type) => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @BeforeInsert()
  @BeforeUpdate()
  createCode(): void {
    this.code = uuidv4();
  }
}