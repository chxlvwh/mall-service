import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsIn, IsNotEmpty } from 'class-validator';
import { EntryMethodEnum, TypeEnum } from '../product-attribute.entity';
import { getEnumValues } from '../../utils/common';

export class CreateProductAttributeDto {
	@ApiProperty({ description: '属性名称' })
	@IsNotEmpty()
	name: string;

	@ApiProperty({ description: '录入方式，1-手动录入， 2-从列表选择' })
	@IsNotEmpty()
	@IsIn(getEnumValues(EntryMethodEnum))
	entryMethod: EntryMethodEnum;

	@ApiProperty({ description: '是否必填' })
	@Allow()
	isRequired: boolean;

	@ApiProperty({ description: '能否被搜索' })
	@Allow()
	canSearch: boolean;

	@ApiProperty({ description: '属性类型，1-基础属性，2-规格属性' })
	@IsIn(getEnumValues(TypeEnum))
	type: TypeEnum;
}
