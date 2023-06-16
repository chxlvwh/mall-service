import { Allow, IsNotEmpty, IsNumber, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { UpdateSkuDto } from './update-sku.dto';

export class UpdateProductDto {
	@IsNotEmpty()
	@Length(1, 60)
	name: string;

	@ApiProperty()
	@IsNotEmpty()
	@Length(1, 20)
	itemNo: string;

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
	@Transform(({ value }) => parseInt(value))
	brandId: number;

	@ApiProperty()
	@IsNotEmpty()
	productCategoryId: number;
	@ApiProperty()
	@Allow()
	@Transform(({ value }) => value.map((sku) => ({ ...sku, id: sku.id ? parseInt(sku.id) : undefined })))
	skus: UpdateSkuDto[];

	@ApiProperty({ description: '上架状态，0：下架，1：上架' })
	@Allow()
	status: number;
}
