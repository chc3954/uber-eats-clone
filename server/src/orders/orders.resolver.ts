import { Args, Mutation, Resolver, Query, Subscription } from '@nestjs/graphql';
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
import { PubSub } from 'graphql-subscriptions';
import { Inject } from '@nestjs/common';
import {
  NEW_COOKED_ORDER,
  NEW_ORDER_UPDATE,
  NEW_PENDING_ORDER,
  PUB_SUB,
} from 'src/common/common.constants';
import { OrderUpdatesInput } from './dtos/order-updates.dto';
import { TakeOrderInput, TakeOrderOutput } from './dtos/take-order.dto';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(
    private readonly ordersService: OrdersService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Mutation(() => CreateOrderOutput)
  @Role(['Client'])
  async createOrder(
    @AuthUser() customer: User,
    @Args('input') createOrderInput: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    return this.ordersService.createOrder(customer, createOrderInput);
  }

  @Query(() => GetOrdersOutput)
  @Role(['Any'])
  async getOrders(
    @AuthUser() user: User,
    @Args('input') getOrdersInput: GetOrdersInput,
  ): Promise<GetOrdersOutput> {
    return this.ordersService.getOrders(user, getOrdersInput);
  }

  @Query(() => GetOrderOutput)
  @Role(['Any'])
  async getOrder(
    @AuthUser() user: User,
    @Args('input') getOrderInput: GetOrderInput,
  ): Promise<GetOrderOutput> {
    return this.ordersService.getOrder(user, getOrderInput);
  }

  @Mutation(() => EditOrderOutput)
  @Role(['Delivery', 'Owner'])
  async editOrder(
    @AuthUser() user: User,
    @Args('input') editOrderInput: EditOrderInput,
  ) {
    return this.ordersService.editOrder(user, editOrderInput);
  }

  @Mutation(() => CancelOrderOutput)
  @Role(['Client'])
  async cancelOrder(
    @AuthUser() user: User,
    @Args('input') cancelOrderInput: CancelOrderInput,
  ): Promise<CancelOrderOutput> {
    return this.ordersService.cancelOrder(user, cancelOrderInput);
  }

  @Subscription(() => Order, {
    filter: ({ pendingOrders: { ownerId } }, _, { user }) => {
      return ownerId === user.id;
    },
    resolve: ({ pendingOrders: { order } }) => order,
  })
  @Role(['Owner'])
  async pendingOrders() {
    return this.pubSub.asyncIterableIterator(NEW_PENDING_ORDER);
  }

  @Subscription(() => Order)
  @Role(['Delivery'])
  cookedOrders() {
    return this.pubSub.asyncIterableIterator(NEW_COOKED_ORDER);
  }

  @Subscription(() => Order, {
    filter: (
      { orderUpdates: order }: { orderUpdates: Order },
      { input }: { input: OrderUpdatesInput },
      { user }: { user: User },
    ) => {
      const isRelatedUser = [
        order.driverId,
        order.customerId,
        order.restaurant.ownerId,
      ].includes(user.id);

      return isRelatedUser && order.id === input.id;
    },
  })
  @Role(['Any'])
  orderUpdates(@Args('input') orderUpdatesInput: OrderUpdatesInput) {
    return this.pubSub.asyncIterableIterator(NEW_ORDER_UPDATE);
  }

  @Mutation(() => TakeOrderOutput)
  @Role(['Delivery'])
  takeOrder(
    @AuthUser() driver: User,
    @Args('input') takeOrderInput: TakeOrderInput,
  ): Promise<TakeOrderOutput> {
    return this.ordersService.takeOrder(driver, takeOrderInput);
  }
}
