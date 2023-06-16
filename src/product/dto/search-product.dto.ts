import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchProductDto {
	@ApiProperty()
	@Allow()
	name: string;

	@ApiProperty()
	@Allow()
	@Transform(({ value }) => parseInt(value))
	status: number;

	@ApiProperty()
	@Allow()
	itemNo: string;

	@ApiProperty()
	@Allow()
	@Transform(({ value }) => parseInt(value))
	brandId: number;

	@ApiProperty()
	@Allow()
	@Transform(({ value }) => parseInt(value))
	productCategoryId: number;
}
