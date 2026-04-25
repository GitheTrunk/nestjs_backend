import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.input';
import { UpdateCategoryDto } from './dto/update-category.input';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly repo: Repository<Category>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  create(dto: CreateCategoryDto) {
    const category = this.repo.create(dto);
    return this.repo.save(category);
  }

  async update(dto: UpdateCategoryDto) {
    const category = await this.repo.findOneBy({ id: dto.id });
    if (!category) {
      throw new Error('Category not found');
    }
    category.name = dto.name;
    return this.repo.save(category);
  }
}