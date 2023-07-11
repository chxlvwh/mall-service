import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon } from './entity/coupon.entity';
import { CouponItem } from './entity/coupon-item.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Coupon, CouponItem])],
	providers: [CouponService],
	controllers: [CouponController],
})
export class CouponModule {}
