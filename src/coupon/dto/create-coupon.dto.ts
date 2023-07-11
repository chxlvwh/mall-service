import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { CouponScope, CouponType } from '../entity/coupon.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCouponDto {
	@ApiProperty({ description: '优惠券名称' })
	@IsNotEmpty()
	name: string;

	@ApiProperty({ description: '优惠券类型' })
	@IsEnum(CouponType)
	type: string;

	@ApiProperty({ description: '优惠券开始时间' })
	@IsNotEmpty()
	startDate: Date;

	@ApiProperty({ description: '优惠券结束时间' })
	@IsNotEmpty()
	endDate: Date;

	@ApiProperty({ description: '优惠券面值' })
	@IsNotEmpty()
	@IsNumber()
	value: number;

	@ApiProperty({ description: '优惠券使用门槛' })
	@IsNotEmpty()
	@IsNumber()
	threshold: number;

	@ApiProperty({ description: '优惠券数量' })
	@IsNotEmpty()
	@IsNumber()
	quantity: number;

	@ApiProperty({ description: '优惠券每人限领数量' })
	@IsNotEmpty()
	@IsNumber()
	quantityPerUser: number;

	@ApiProperty({ description: '优惠券使用范围' })
	@IsEnum(CouponScope)
	scope: CouponScope;
}
