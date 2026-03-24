import { IsDateString, IsIn, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateOrderDto {
	@IsOptional()
	@IsDateString()
	orderedAt?: string;

	@IsOptional()
	@IsString()
	customerName?: string;

	@IsOptional()
	@IsInt()
	@Min(1)
	quantity?: number;

	@IsOptional()
	@IsNumber()
	@Min(0)
	totalAmount?: number;

	@IsOptional()
	@IsString()
	@IsIn(['pending', 'paid', 'cancelled'])
	status?: string;
}
