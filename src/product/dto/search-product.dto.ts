import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchProductDto {
	@ApiPropertyOptional({ description: '商品名称' })
	@IsOptional()
	name: string;

	@ApiPropertyOptional({ description: '商品状态 0:下架 1:上架' })
	@IsOptional()
	@Transform(({ value }) => parseInt(value))
	status: number;

	@ApiPropertyOptional({ description: '商品货号' })
	@IsOptional()
	itemNo: string;

	@ApiPropertyOptional({ description: '商品分类id' })
	@IsOptional()
	@Transform(({ value }) => parseInt(value))
	brandId: number;

	@ApiPropertyOptional({ description: '商品品牌id' })
	@IsOptional()
	@Transform(({ value }) => parseInt(value))
	productCategoryId: number;

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
