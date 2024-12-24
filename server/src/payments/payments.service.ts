import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { LessThan, Repository } from 'typeorm';
import {
  CreatePaymentInput,
  CreatePaymentOutput,
} from './dtos/create-payment.dto';
import { User } from 'src/users/entities/user.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { GetPaymentOutput } from './dtos/get-payment.dto';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly payments: Repository<Payment>,
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  async createPayment(
    owner: User,
    { transactionId, restaurantId }: CreatePaymentInput,
  ): Promise<CreatePaymentOutput> {
    try {
      const restaurant = await this.restaurants.findOne({
        where: { id: restaurantId },
      });

      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found.',
        };
      }

      if (restaurant.ownerId !== owner.id) {
        return {
          ok: false,
          error: "You can't do that.",
        };
      }
      restaurant.isPromoted = true;
      const date = new Date();
      date.setMonth(date.getDate() + 7);
      restaurant.promotedUntil = date;
      this.restaurants.save(restaurant);

      await this.payments.save(
        this.payments.create({ transactionId, user: owner, restaurant }),
      );

      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not create payment.',
      };
    }
  }

  async getPayments(user: User): Promise<GetPaymentOutput> {
    try {
      const payments = await this.payments.find({
        where: { user: { id: user.id } },
      });
      return { ok: true, payments };
    } catch {
      return {
        ok: false,
        error: 'Could not find payments',
      };
    }
  }

  @Cron('0 0 * * * *')
  async checkPromotedRestaurants() {
    const restaurants = await this.restaurants.find({
      where: {
        isPromoted: true,
        promotedUntil: LessThan(new Date()),
      },
    });

    restaurants.forEach(async (restaurant) => {
      restaurant.isPromoted = false;
      restaurant.promotedUntil = null;
      await this.restaurants.save(restaurant);
    });
  }
}
