import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { OrderItem } from './entity/order-item.entity';
import { CouponModule } from '../coupon/coupon.module';
import { ProductModule } from '../product/product.module';
import { PublicOrderController } from './order.public.controller';

@Module({
	imports: [TypeOrmModule.forFeature([Order, OrderItem]), CouponModule, ProductModule],
	providers: [OrderService],
	controllers: [OrderController, PublicOrderController],
	exports: [OrderService],
})
export class OrderModule {}
