import { Module } from '@nestjs/common';
import { CategoryResolver } from './resolvers/category.resolver';
import { ProductResolver } from './resolvers/product.resolver';
import { CategoryModule } from '../category/category.module';
import { ProductModule } from '../product/product.module';
import { CategoryCodeFirstResolver } from './resolvers/category.codefirst.resolver';
import { ProductCodeFirstResolver } from './resolvers/product.codefirst.resolver';

@Module({
  imports: [CategoryModule, ProductModule],
  // providers: [CategoryResolver, ProductResolver],
  providers: [CategoryCodeFirstResolver, ProductCodeFirstResolver],
})
export class GraphqlModule {}