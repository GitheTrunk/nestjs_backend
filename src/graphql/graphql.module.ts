import { Module } from '@nestjs/common';
import { CategoryResolver } from './resolvers/category.resolver';
import { ProductResolver } from './resolvers/product.resolver';
import { CategoryModule } from '../category/category.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [CategoryModule, ProductModule],
  providers: [CategoryResolver, ProductResolver],
})
export class GraphqlModule {}