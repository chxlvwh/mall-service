import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderSetting, OrderSettingKey } from '../order-setting/order-setting.entity';
import { Order, OrderStatus } from '../order/entity/order.entity';
import { log } from 'winston';

@Injectable()
export class TaskService {
	constructor(
		@InjectRepository(OrderSetting)
		private readonly orderSettingRepository: Repository<OrderSetting>,
		@InjectRepository(Order)
		private readonly orderRepository: Repository<Order>,
	) {}
	@Cron(CronExpression.EVERY_MINUTE)
	async handleUnpaidOrderTimeout() {
		console.log('每分钟执行一次');
		/** 1. 获取订单超时时间 */
		const normalOrderOverTime = await this.orderSettingRepository.findOne({
			where: { key: OrderSettingKey.NormalOrderTimeout },
		});
		/** 2. 获取未支付订单 */
		const unpaidOrders = await this.orderRepository.find({
			where: { status: OrderStatus.UNPAID },
		});
		/** 3. 判断是否超时 */
		for (let i = 0; i < unpaidOrders.length; i++) {
			const order = unpaidOrders[i];
			const now = new Date();
			const orderTime = order.createdAt;
			const orderOverTime = new Date(orderTime.getTime() + normalOrderOverTime.value * 60 * 1000);
			if (now > orderOverTime) {
				/** 4. 超时则关闭订单 */
				order.status = OrderStatus.CLOSED;
				await this.orderRepository.save(order);
			}
		}
	}
}
