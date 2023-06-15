import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateSkuDto {
	@ApiProperty()
	@Allow()
	@Transform(({ value }) => parseInt(value))
	id: number;

	@ApiProperty()
	@Allow()
	price: number;

	@ApiProperty()
	@Allow()
	stock: number;

	@ApiProperty()
	@Allow()
	props: JSON;
}
