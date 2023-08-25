import { IsNotEmpty } from 'class-validator';

export class CreatePeriodProductDto {
	@IsNotEmpty()
	count: number;

	@IsNotEmpty()
	price: number;

	@IsNotEmpty()
	limited: number;

	@IsNotEmpty()
	sort: number;
}
