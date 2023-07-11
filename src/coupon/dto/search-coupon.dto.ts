import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class SearchCouponDto {
	@ApiPropertyOptional({ description: '优惠券名称' })
	@IsOptional()
	name: string;

	@ApiPropertyOptional({ description: '优惠券类型' })
	@IsOptional()
	type: string;

	@ApiPropertyOptional({ description: '优惠券状态' })
	@IsOptional()
	status: string;

	@ApiPropertyOptional({ description: '优惠券使用范围' })
	@IsOptional()
	scope: string;

	@ApiPropertyOptional({ description: '优惠券开始时间' })
	@IsOptional()
	startDate: Date;

	@ApiPropertyOptional({ description: '优惠券结束时间' })
	@IsOptional()
	endDate: Date;

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
