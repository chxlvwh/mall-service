import { Allow, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Sku } from '../entity/sku.entity';
import { Column } from 'typeorm';

export class CreateProductDto {
	@ApiProperty()
	@IsNotEmpty()
	@Length(1, 60)
	name: string;

	@ApiProperty()
	@Allow()
	itemNo: string;

	@ApiProperty()
	@IsNotEmpty()
	originPrice: number;

	@ApiProperty()
	@IsNotEmpty()
	salePrice: number;

	@ApiProperty()
	@IsNotEmpty()
	coverUrls: JSON;

	@ApiProperty()
	@IsNotEmpty()
	content: string;

	@ApiProperty()
	@IsNotEmpty()
	brandId: number;

	@ApiProperty()
	@IsNotEmpty()
	productCategoryId: number;

	@ApiProperty()
	@Allow()
	subtitle: string;

	@ApiProperty()
	@Allow()
	introduction: string;

	@ApiProperty()
	@Allow()
	stock: number;

	@ApiProperty()
	@Allow()
	unit: string;

	@ApiProperty()
	@Allow()
	weight: number;

	@ApiProperty({ description: 'id: 属性id, name:属性名，value:属性值' })
	@Allow()
	props: JSON;

	@ApiProperty()
	@Allow({ each: true })
	skus: Sku[];

	@ApiProperty({ description: '上架状态，0：下架，1：上架' })
	@Allow()
	@IsNotEmpty()
	status: number;
}
