import { IsDateString, IsIn, IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateOrderDto {
	@IsDateString()
	orderedAt!: string;

	@IsString()
	@IsNotEmpty()
	customerName!: string;

	@IsInt()
	@Min(1)
	quantity!: number;

	@IsNumber()
	@Min(0)
	totalAmount!: number;

	@IsString()
	@IsIn(['pending', 'paid', 'cancelled'])
	status!: string;
}
