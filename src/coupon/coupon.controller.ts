import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { SearchCouponDto } from './dto/search-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { SearchCouponDetailDto } from './dto/search-coupon-detail.dto';
import { AdminGuard } from '../guards/admin.guard';

@Controller('coupon')
@UseGuards(JwtGuard)
export class CouponController {
	constructor(private readonly couponService: CouponService) {}

	@UseGuards(AdminGuard)
	@Post()
	async generateCoupon(@Body() createCouponDto: CreateCouponDto) {
		return await this.couponService.generateCoupon(createCouponDto);
	}

	@Get()
	async findAll(@Query() searchCouponDto: SearchCouponDto) {
		return await this.couponService.findAll(searchCouponDto);
	}

	// 获取优惠券详情
	@Get(':id')
	async findOne(@Param('id', ParseIntPipe) id: number, @Query() getCouponDetailDto: SearchCouponDetailDto) {
		return await this.couponService.findOne(id, getCouponDetailDto);
	}

	// 更新优惠券
	@Put(':id')
	async updateCoupon(@Param('id', ParseIntPipe) id: number, @Body() updateCouponDto: UpdateCouponDto) {
		return await this.couponService.updateCoupon(id, updateCouponDto);
	}

	// 领取优惠券
	@Post(':id/receive')
	async receiveCoupon(@Param('id', ParseIntPipe) id: number, @Req() request) {
		return await this.couponService.receiveCoupon(request.user.userId, id);
	}

	// 获取领取的优惠券
	@Get(':id/coupon-items')
	async getCouponItems(@Param('id', ParseIntPipe) id: number) {
		return await this.couponService.getCouponItems(id);
	}

	// 删除优惠券
	@Delete(':id')
	async deleteCoupon(@Param('id', ParseIntPipe) id: number) {
		return await this.couponService.deleteCoupon(id);
	}

	// 获取产品有效的优惠券
	@Get('product/:productId/valid')
	async getValidCoupons(@Param('productId', ParseIntPipe) productId: number) {
		return await this.couponService.getValidCoupons(productId);
	}
}
