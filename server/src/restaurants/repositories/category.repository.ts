import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoryRepository extends Repository<Category> {
  constructor(private dataSource: DataSource) {
    super(Category, dataSource.createEntityManager());
  }

  async getOrCreate(name: string): Promise<Category> {
    const categoryName = name.trim().toLowerCase(); // Trim whitespace and convert to lowercase.
    const categorySlug = categoryName.replace(/ /g, '-'); // Replace spaces with hyphens.

    let category = await this.findOne({
      where: { slug: categorySlug },
    });
    // If the category does not exist, create it.
    if (!category) {
      const newCategory = this.create({
        name: categoryName,
        slug: categorySlug,
      });
      category = await this.save(newCategory);
    }

    return category;
  }
}
