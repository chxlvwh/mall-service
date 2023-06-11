import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { EntryMethodEnum, TypeEnum } from '../product-attribute.entity';

export class SearchProductAttribute {
	@IsOptional()
	name: string;

	@ApiProperty({ description: '录入方式，1-手动录入， 2-从列表选择' })
	@IsOptional()
	entryMethod: EntryMethodEnum;

	@ApiProperty({ description: '是否必填' })
	@IsOptional()
	isRequired: boolean;

	@ApiProperty({ description: '能否被搜索' })
	@IsOptional()
	canSearch: boolean;

	@ApiProperty({ description: '属性类型，1-基础属性，2-规格属性' })
	@IsOptional()
	type: TypeEnum;
}
