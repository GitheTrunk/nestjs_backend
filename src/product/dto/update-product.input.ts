import { CreateProductDto } from './create-product.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  id!: number;
  name?: string;
  price?: number;
  categoryId?: number;
}
