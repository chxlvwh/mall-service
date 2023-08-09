import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { ScheduleModule } from '@nestjs/schedule';
import { OrderSetting } from '../order-setting/order-setting.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../order/entity/order.entity';

@Module({
	imports: [ScheduleModule.forRoot(), TypeOrmModule.forFeature([OrderSetting, Order])],
	controllers: [TaskController],
	providers: [TaskService],
})
export class TaskModule {}
