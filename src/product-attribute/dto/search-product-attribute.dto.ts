import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { EntryMethodEnum, TypeEnum } from '../product-attribute.entity';

export class SearchProductAttributeDto {
	@IsOptional()
	name: string;

	@ApiPropertyOptional({ description: '录入方式，1-手动录入， 2-从列表选择' })
	@IsOptional()
	entryMethod: EntryMethodEnum;

	@ApiPropertyOptional({ description: '是否必填' })
	@IsOptional()
	isRequired: number;

	@ApiPropertyOptional({ description: '能否被搜索' })
	@IsOptional()
	canSearch: number;

	@ApiPropertyOptional({ description: '属性类型，1-基础属性，2-规格属性' })
	@IsOptional()
	type: TypeEnum;

	@ApiPropertyOptional({ description: '第几页' })
	@IsOptional()
	current: number;

	@ApiPropertyOptional({ description: '每页条数' })
	@IsOptional()
	pageSize?: number;

	@ApiPropertyOptional({ description: '排序字段' })
	@IsOptional()
	sortBy?: string;

	@ApiPropertyOptional({ description: '排序方式 ASC：正序，DESC：逆序' })
	@IsOptional()
	sortOrder?: 'ASC' | 'DESC';
}
