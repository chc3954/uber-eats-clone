import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';
import { User } from 'src/users/entities/user.entity';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { Role } from 'src/auth/role.decorator';
import { AuthUser } from 'src/auth/auth.decorator';
import { GetOrdersInput, GetOrdersOutput } from './dtos/get-orders.dto';
import { GetOrderInput, GetOrderOutput } from './dtos/get-order.dto';
import { EditOrderInput, EditOrderOutput } from './dtos/edit-order.dto';
import { CancelOrderInput, CancelOrderOutput } from './dtos/cancel-order.dto';

@Resolver((of) => Order)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Mutation((returns) => CreateOrderOutput)
  @Role(['Client'])
  async createOrder(
    @AuthUser() customer: User,
    @Args('input') createOrderInput: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    return this.ordersService.createOrder(customer, createOrderInput);
  }

  @Query((returns) => GetOrdersOutput)
  @Role(['Any'])
  async getOrders(
    @AuthUser() user: User,
    @Args('input') getOrdersInput: GetOrdersInput,
  ): Promise<GetOrdersOutput> {
    return this.ordersService.getOrders(user, getOrdersInput);
  }

  @Query((returns) => GetOrderOutput)
  @Role(['Any'])
  async getOrder(
    @AuthUser() user: User,
    @Args('input') getOrderInput: GetOrderInput,
  ): Promise<GetOrderOutput> {
    return this.ordersService.getOrder(user, getOrderInput);
  }

  @Mutation((returns) => EditOrderOutput)
  @Role(['Delivery', 'Owner'])
  async editOrder(
    @AuthUser() user: User,
    @Args('input') editOrderInput: EditOrderInput,
  ) {
    return this.ordersService.editOrder(user, editOrderInput);
  }

  @Mutation((returns) => CancelOrderOutput)
  @Role(['Client'])
  async cancelOrder(
    @AuthUser() user: User,
    @Args('input') cancelOrderInput: CancelOrderInput,
  ): Promise<CancelOrderOutput> {
    return this.ordersService.cancelOrder(user, cancelOrderInput);
  }
}
