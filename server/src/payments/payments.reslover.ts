import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Payment } from './entities/payment.entity';
import { PaymentsService } from './payments.service';
import {
  CreatePaymentInput,
  CreatePaymentOutput,
} from './dtos/create-payment.dto';
import { Role } from 'src/auth/role.decorator';
import { AuthUser } from 'src/auth/auth.decorator';
import { User } from 'src/users/entities/user.entity';
import { Query } from '@nestjs/graphql';
import { GetPaymentOutput } from './dtos/get-payment.dto';

@Resolver(() => Payment)
export class PaymentsResolver {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Mutation(() => CreatePaymentOutput)
  @Role(['Owner'])
  async createPayment(
    @AuthUser() owner: User,
    @Args('input') createPaymentInput: CreatePaymentInput,
  ): Promise<CreatePaymentOutput> {
    return this.paymentsService.createPayment(owner, createPaymentInput);
  }

  @Query(() => GetPaymentOutput)
  @Role(['Owner'])
  getPayments(@AuthUser() user: User): Promise<GetPaymentOutput> {
    return this.paymentsService.getPayments(user);
  }
}
