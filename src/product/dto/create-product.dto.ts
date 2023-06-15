import { Allow, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Sku } from '../sku.entity';

export class CreateProductDto {
	@ApiProperty()
	@IsNotEmpty()
	@Length(1, 60)
	name: string;

	@ApiProperty()
	@IsNotEmpty()
	originPrice: number;

	@ApiProperty()
	@IsNotEmpty()
	salePrice: number;

	@ApiProperty()
	@IsNotEmpty()
	brandId: number;

	@ApiProperty()
	@IsNotEmpty()
	productCategoryId: number;

	@ApiProperty()
	@IsNotEmpty()
	subtitle: string;

	@ApiProperty()
	@Allow()
	introduction: string;

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
	@Allow({ each: true })
	skus: Sku[];
}
