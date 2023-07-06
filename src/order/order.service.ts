import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Order } from './entity/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from './entity/order-item.entity';

@Injectable()
export class OrderService {
	constructor(
		@InjectRepository(Order) private readonly orderRepository: Repository<Order>,
		@InjectRepository(OrderItem) private readonly orderItemRepository: Repository<OrderItem>,
	) {}

	async createOrder(order: Order) {
		return this.orderRepository.save(order);
	}
}
