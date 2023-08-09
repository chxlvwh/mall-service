import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderSetting, OrderSettingKey } from '../order-setting/order-setting.entity';
import { Order, OrderStatus } from '../order/entity/order.entity';

@Injectable()
export class TaskService {
	constructor(
		@InjectRepository(OrderSetting)
		private readonly orderSettingRepository: Repository<OrderSetting>,
		@InjectRepository(Order)
		private readonly orderRepository: Repository<Order>,
	) {}
	@Cron(CronExpression.EVERY_5_SECONDS)
	async handleUnpaidOrderTimeout() {
		console.log('每分钟执行一次');
		const normalOrderOverTime = await this.orderSettingRepository.findOne({
			where: { key: OrderSettingKey.NormalOrderTimeout },
		});
		const unpaidOrders = await this.orderRepository.find({
			where: { status: OrderStatus.UNPAID },
		});
	}
}
