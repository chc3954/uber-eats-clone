import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { Repository } from 'typeorm';
import { User, UserRole } from 'src/users/entities/user.entity';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { OrderItem } from './entities/order-item.entity';
import { Dish } from 'src/restaurants/entities/dish.entity';
import { GetOrdersInput, GetOrdersOutput } from './dtos/get-orders.dto';
import { GetOrderInput, GetOrderOutput } from './dtos/get-order.dto';
import { EditOrderInput, EditOrderOutput } from './dtos/edit-order.dto';
import { CancelOrderInput, CancelOrderOutput } from './dtos/cancel-order.dto';
import {
  NEW_COOKED_ORDER,
  NEW_ORDER_UPDATE,
  NEW_PENDING_ORDER,
  PUB_SUB,
} from 'src/common/common.constants';
import { TakeOrderInput, TakeOrderOutput } from './dtos/take-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orders: Repository<Order>,
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    @InjectRepository(OrderItem)
    private readonly orderItems: Repository<OrderItem>,
    @InjectRepository(Dish)
    private readonly dishes: Repository<Dish>,
    @Inject(PUB_SUB) private readonly pubSub: any,
  ) {}

  async createOrder(
    customer: User,
    { restaurantId, items }: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    try {
      const restaurant = await this.restaurants.findOne({
        where: { id: restaurantId },
      });
      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found',
        };
      }

      let orderTotal = 0;
      const orderItems: OrderItem[] = [];
      for (const item of items) {
        const dish = await this.dishes.findOne({
          where: { id: item.dishId },
        });
        if (!dish) {
          return {
            ok: false,
            error: 'Dish not found',
          };
        }
        let dishTotal = dish.price;
        for (const itemOption of item.options) {
          const dishOption = dish.options.find(
            (dishOption) => dishOption.name === itemOption.name,
          );
          if (dishOption) {
            if (dishOption.extra) {
              dishTotal = dishTotal + dishOption.extra;
            } else {
              const dishOptionChoice = dishOption.choices.find(
                (optionChoice) => optionChoice.name === itemOption.choice,
              );
              if (dishOptionChoice && dishOptionChoice.extra) {
                dishTotal = dishTotal + dishOptionChoice.extra;
              }
            }
          }
        }
        orderTotal = orderTotal + dishTotal;
        const orderItem = await this.orderItems.save(
          this.orderItems.create({ dish, options: item.options }),
        );
        orderItems.push(orderItem);
      }
      const order = await this.orders.save(
        this.orders.create({
          customer,
          restaurant,
          items: orderItems,
          total: orderTotal,
        }),
      );
      await this.pubSub.publish(NEW_PENDING_ORDER, {
        pendingOrders: { order, ownerId: restaurant.ownerId },
      });
      return { ok: true, orderId: order.id };
    } catch {
      return { ok: false, error: 'Could not create order.' };
    }
  }

  async getOrders(
    user: User,
    { status }: GetOrdersInput,
  ): Promise<GetOrdersOutput> {
    try {
      let orders: Order[];

      switch (user.role) {
        case UserRole.Client:
          orders = await this.orders.find({
            where: { customer: { id: user.id }, ...(status && { status }) },
          });
          break;
        case UserRole.Delivery:
          orders = await this.orders.find({
            where: { driver: { id: user.id }, ...(status && { status }) },
          });
          break;
        case UserRole.Owner:
          const restaurants = await this.restaurants.find({
            where: { owner: { id: user.id } },
            relations: ['orders'],
          });
          orders = restaurants
            .map((restaurant) => restaurant.orders)
            .flat(1)
            .filter((order) => (status ? order.status === status : true));
          break;
      }
      return { ok: true, orders };
    } catch {
      return {
        ok: false,
        error: 'Could not get orders.',
      };
    }
  }

  canSeeOrder(user: User, order: Order): boolean {
    let canSee: boolean = true;
    switch (user.role) {
      case UserRole.Client:
        canSee = order.customerId === user.id;
        break;
      case UserRole.Delivery:
        canSee = order.driverId === user.id;
        break;
      case UserRole.Owner:
        canSee = order.restaurant.ownerId === user.id;
        break;
    }
    return canSee;
  }

  async getOrder(
    user: User,
    { id: orderId }: GetOrderInput,
  ): Promise<GetOrderOutput> {
    try {
      const order = await this.orders.findOne({
        where: { id: orderId },
        relations: ['restaurant'],
      });
      if (!order) {
        return {
          ok: false,
          error: 'Order not found.',
        };
      }
      if (!this.canSeeOrder(user, order)) {
        return {
          ok: false,
          error: 'You cannot see that.',
        };
      }
      return {
        ok: true,
        order,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not get order.',
      };
    }
  }

  async editOrder(
    user: User,
    { id: orderId, status }: EditOrderInput,
  ): Promise<EditOrderOutput> {
    try {
      const order = await this.orders.findOne({
        where: { id: orderId },
      });
      if (!order) {
        return {
          ok: false,
          error: 'Order not found.',
        };
      }
      if (!this.canSeeOrder(user, order)) {
        return {
          ok: false,
          error: 'You cannot do that.',
        };
      }
      await this.orders.save({
        id: orderId,
        status,
      });

      const newOrder = { ...order, status };

      if (user.role === UserRole.Owner) {
        if (status === OrderStatus.Cooked) {
          await this.pubSub.publish(NEW_COOKED_ORDER, {
            cookedOrders: newOrder,
          });
        }
      }

      await this.pubSub.publish(NEW_ORDER_UPDATE, { orderUpdates: newOrder });

      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not edit order.',
      };
    }
  }

  async cancelOrder(
    user: User,
    { id: orderId }: CancelOrderInput,
  ): Promise<CancelOrderOutput> {
    try {
      const order = await this.orders.findOne({
        where: { id: orderId },
      });
      if (!order) {
        return {
          ok: false,
          error: 'Order not found.',
        };
      }
      if (order.customerId !== user.id) {
        return {
          ok: false,
          error: 'You are not allowed to do this.',
        };
      }
      if (order.status !== 'Pending') {
        return {
          ok: false,
          error: 'You cannot cancel this order.',
        };
      }
      await this.orders.save({
        ...order,
        status: OrderStatus.Cancelled,
      });
      return { ok: true };
    } catch {
      return {
        ok: false,
        error: 'Could not cancel order.',
      };
    }
  }

  async takeOrder(
    driver: User,
    { id: orderId }: TakeOrderInput,
  ): Promise<TakeOrderOutput> {
    try {
      const order = await this.orders.findOne({
        where: { id: orderId },
      });
      if (!order) {
        return {
          ok: false,
          error: 'Order not found.',
        };
      }
      if (order.driver) {
        return {
          ok: false,
          error: 'This order already has a driver.',
        };
      }
      await this.orders.save({
        id: orderId,
        driver,
      });
      await this.pubSub.publish(NEW_ORDER_UPDATE, {
        orderUpdates: { ...order, driver },
      });
      return { ok: true };
    } catch {
      return {
        ok: false,
        error: 'Could not take order.',
      };
    }
  }
}
