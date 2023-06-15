import { Allow, IsNotEmpty } from 'class-validator';

export class UpdateProductDto {
	@IsNotEmpty()
	name: string;

	@Allow()
	subtitle: string;

	@Allow()
	introduction: string;

	@IsNotEmpty()
	originPrice: number;

	@IsNotEmpty()
	salePrice: number;

	@Allow()
	stock: number;

	@Allow()
	units: string;

	@Allow()
	weight: number;

	@IsNotEmpty()
	brandId: number;

	@IsNotEmpty()
	productCategoryId: number;
}
