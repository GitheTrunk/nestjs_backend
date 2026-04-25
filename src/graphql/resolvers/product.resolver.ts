import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ProductService } from '../../product/product.service';
import { CategoryService } from '../../category/category.service';

@Resolver('Product')
export class ProductResolver {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
  ) {}

  @Query('products')
  products() {
    return this.productService.findAll();
  }

  @Query('product')
  product(@Args('id') id: string) {
    return this.productService.findOne(Number(id));
  }

  @Mutation('createProduct')
  createProduct(
    @Args('name') name: string,
    @Args('price') price: number,
    @Args('categoryId') categoryId: string,
  ) {
    return this.productService.create({
      name,
      price,
      categoryId: Number(categoryId),
    });
  }

  @ResolveField('category')
  category(@Parent() product: any) {
    return this.categoryService.findOne(product.categoryId);
  }

  @Mutation('updateProduct')
  updateProduct(
    @Args('id') id: string,
    @Args('name') name: string,
    @Args('price') price: number,
    @Args('categoryId') categoryId: string,
  ) {
    return this.productService.update({
      id: Number(id),
      name,
      price,
      categoryId: Number(categoryId),
    });
  }
}