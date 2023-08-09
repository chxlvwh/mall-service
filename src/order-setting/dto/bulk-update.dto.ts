import { IsNotEmpty, IsOptional } from 'class-validator';
import { OrderSettingKey } from '../order-setting.entity';

export class BulkUpdateDto {
	@IsOptional()
	key: OrderSettingKey;

	@IsOptional()
	value: number;
}
