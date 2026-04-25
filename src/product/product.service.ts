import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.input';
import { UpdateProductDto } from './dto/update-product.input';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  create(dto: CreateProductDto) {
    const product = this.repo.create(dto);
    return this.repo.save(product);
  }

  async update(dto: UpdateProductDto) {
    const product = await this.repo.findOneBy({ id: dto.id });
    if (!product) {
      throw new Error('Product not found');
    }
    if (dto.name !== undefined) {
      product.name = dto.name;
    }
    if (dto.price !== undefined) {
      product.price = dto.price;
    }
    if (dto.categoryId !== undefined) {
      product.categoryId = dto.categoryId;
    }
    return this.repo.save(product);
  }

}