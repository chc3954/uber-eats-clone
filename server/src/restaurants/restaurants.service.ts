import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { Repository } from 'typeorm';
import { CreateRestaurantInput } from './dtos/create-restaurant.dto';
import { User } from 'src/users/entities/user.entity';
import { CreateAccountOutput } from 'src/users/dtos/create-account.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
  ) {}

  async createRestaurant(
    owner: User,
    createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateAccountOutput> {
    try {
      const newRestaurant = this.restaurants.create(createRestaurantInput);
      newRestaurant.owner = owner;
      const categoryName = createRestaurantInput.categoryName
        .trim()
        .toLowerCase();
      const categorySlug = categoryName.replace(/ /g, '-');
      let category = await this.categories.findOne({
        where: { slug: categorySlug },
      });
      if (!category) {
        const newCategory = this.categories.create({
          name: categoryName,
          slug: categorySlug,
        });
        category = await this.categories.save(newCategory);
      }
      newRestaurant.category = category;
      await this.restaurants.save(newRestaurant);
      return { ok: true };
    } catch {
      return { ok: false, error: 'Could not create restaurant' };
    }
  }
}
