import { Module } from '@nestjs/common';
import { OrderSettingController } from './order-setting.controller';
import { OrderSettingService } from './order-setting.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderSetting } from './order-setting.entity';

@Module({
	imports: [TypeOrmModule.forFeature([OrderSetting])],
	controllers: [OrderSettingController],
	providers: [OrderSettingService],
})
export class OrderSettingModule {}
