import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { OrderSettingService } from './order-setting.service';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { OrderSettingKey } from './order-setting.entity';
import { BulkUpdateDto } from './dto/bulk-update.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { AdminGuard } from '../guards/admin.guard';

@UseGuards(JwtGuard, AdminGuard)
@Controller('order-setting')
export class OrderSettingController {
	constructor(private readonly orderSettingService: OrderSettingService) {}

	@Get('')
	async findAll() {
		return await this.orderSettingService.findAll();
	}

	/** 批量更新订单设置 */
	@Put('bulk')
	async bulkUpdateOrderSetting(@Body() bulkUpdateDtos: BulkUpdateDto[]) {
		return await this.orderSettingService.bulkUpdateOrderSetting(bulkUpdateDtos);
	}

	@Put(':key')
	async updateOrderSetting(@Param('key') key: OrderSettingKey, @Body() updateSettingDto: UpdateSettingDto) {
		return await this.orderSettingService.updateOrderSetting(key, updateSettingDto);
	}
}
