import { Allow, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Sku } from '../sku.entity';

export class UpdateProductDto {
	@IsNotEmpty()
	name: string;

	@ApiProperty()
	@Allow()
	subtitle: string;

	@ApiProperty()
	@Allow()
	introduction: string;

	@ApiProperty()
	@IsNotEmpty()
	originPrice: number;

	@ApiProperty()
	@IsNotEmpty()
	salePrice: number;

	@ApiProperty()
	@Allow()
	stock: number;

	@ApiProperty()
	@Allow()
	units: string;

	@ApiProperty()
	@Allow()
	weight: number;

	@ApiProperty()
	@IsNotEmpty()
	brandId: number;

	@ApiProperty()
	@IsNotEmpty()
	productCategoryId: number;

	@ApiProperty()
	@Allow()
	skus: Sku[];
}
