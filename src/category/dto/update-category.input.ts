import { CreateCategoryDto } from './create-category.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  id!: number;
  name!: string;
}
