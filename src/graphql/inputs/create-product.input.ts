import { InputType, Field, Float, ID } from '@nestjs/graphql';
import { IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class CreateProductInput {
  @Field()
  @IsString()
  name!: string;

  @Field(() => Float)
  @Type(() => Number)
  @IsNumber()
  price!: number;

  @Field(() => ID)
  @Type(() => Number)
  @IsNumber()
  categoryId!: number;
}