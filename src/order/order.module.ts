import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import ormconfig from '../../ormconfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { OrderItem } from './entity/order-item.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Order, OrderItem])],
	providers: [OrderService],
	controllers: [OrderController],
	exports: [OrderService],
})
export class OrderModule {}
