import { Allow, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchOrderDto {
	@ApiProperty({ description: '订单id' })
	@Allow()
	orderNo: string;

	@ApiProperty({ description: '订单状态' })
	@Allow()
	status: string;

	// 支付方式
	@ApiProperty({ description: '支付方式' })
	@Allow()
	paymentMethod: string;

	@ApiProperty({ description: '最早创建时间' })
	@Allow()
	startDate: string;

	@ApiProperty({ description: '最晚创建时间' })
	@Allow()
	endDate: string;

	@ApiProperty({ description: '账号' })
	@Allow()
	username: string;

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
