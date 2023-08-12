import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderSetting, OrderSettingKey } from './order-setting.entity';
import { Repository } from 'typeorm';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { BulkUpdateDto } from './dto/bulk-update.dto';

@Injectable()
export class OrderSettingService {
	constructor(
		@InjectRepository(OrderSetting)
		private readonly orderSettingRepository: Repository<OrderSetting>,
	) {}

	async findAll() {
		return await this.orderSettingRepository.find();
	}

	async updateOrderSetting(key: OrderSettingKey, updateSettingDto: UpdateSettingDto) {
		const orderSetting = await this.orderSettingRepository.findOne({ where: { key } });
		const { value } = updateSettingDto;
		orderSetting.value = value;
		return await this.orderSettingRepository.save(orderSetting);
	}

	/** 批量更新订单设置 */
	async bulkUpdateOrderSetting(bulkUpdateDtos: BulkUpdateDto[]) {
		for (let i = 0; i < bulkUpdateDtos.length; i++) {
			const { key, value } = bulkUpdateDtos[i];
			const orderSetting = await this.orderSettingRepository.findOne({ where: { key } });
			orderSetting.value = value;
			await this.orderSettingRepository.save(orderSetting);
		}
		return true;
	}
}
