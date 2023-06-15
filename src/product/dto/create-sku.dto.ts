import { Allow } from 'class-validator';

export class CreateSkuDto {
	@Allow()
	price: number;

	@Allow()
	stock: number;

	@Allow()
	props: JSON;
}
