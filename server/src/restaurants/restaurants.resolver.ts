import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantInput } from './dtos/create-restaurant.dto';
import { RestaurantService } from './restaurants.service';
import { CreateAccountOutput } from 'src/users/dtos/create-account.dto';
import { AuthUser } from 'src/auth/auth.decorator';
import { User } from 'src/users/entities/user.entity';

@Resolver((of) => Restaurant)
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Mutation((returns) => CreateAccountOutput)
  async createRestaurant(
    @AuthUser() authUser: User,
    @Args('input') createRestaurnatInput: CreateRestaurantInput,
  ): Promise<CreateAccountOutput> {
    return this.restaurantService.createRestaurant(
      authUser,
      createRestaurnatInput,
    );
  }
}
