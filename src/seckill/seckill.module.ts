import { Module } from '@nestjs/common';
import { SeckillService } from './seckill.service';
import { SeckillController } from './seckill.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seckill } from './entity/seckill.entity';
import { SeckillPeriod } from './entity/seckill-period.entity';
import { Product } from '../product/entity/product.entity';
import { PeriodProduct } from './entity/period-product.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Seckill, SeckillPeriod, Product, PeriodProduct])],
	providers: [SeckillService],
	controllers: [SeckillController],
})
export class SeckillModule {}
