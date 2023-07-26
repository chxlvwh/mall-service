import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon } from './entity/coupon.entity';
import { CouponItem } from './entity/coupon-item.entity';
import { ProductModule } from '../product/product.module';
import { ProductCategoryModule } from '../product-category/product-category.module';

@Module({
	imports: [TypeOrmModule.forFeature([Coupon, CouponItem]), ProductModule, ProductCategoryModule],
	providers: [CouponService],
	controllers: [CouponController],
	exports: [CouponService],
})
export class CouponModule {}
