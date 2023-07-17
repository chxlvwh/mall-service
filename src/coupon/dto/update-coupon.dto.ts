import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsConditionalRequired } from '../../decorators/validator.decorator';
import { CouponScope } from '../entity/coupon.entity';

export class UpdateCouponDto {
	@IsOptional()
	startDate: Date;

	@IsOptional()
	endDate: Date;

	@ApiProperty({ description: '可用商品' })
	@IsConditionalRequired('scope', CouponScope.PRODUCT, { message: '可用产品不能为空' })
	productIds: number[];

	@ApiProperty({ description: '可用分类' })
	@IsConditionalRequired('scope', CouponScope.CATEGORY, { message: '可用分类不能为空' })
	categoryIds: number[];
}
