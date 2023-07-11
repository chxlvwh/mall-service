import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { SearchCouponDto } from './dto/search-coupon.dto';

@Controller('coupon')
export class CouponController {
	constructor(private readonly couponService: CouponService) {}

	@Post()
	async generateCoupon(@Body() createCouponDto: CreateCouponDto) {
		return await this.couponService.generateCoupon(createCouponDto);
	}

	@Get()
	async findAll(@Query() searchCouponDto: SearchCouponDto) {
		return await this.couponService.findAll(searchCouponDto);
	}
}
