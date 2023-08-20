import { IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchSeckillDto {
	@ApiPropertyOptional({ description: '活动名称' })
	@IsOptional()
	name: string;

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
