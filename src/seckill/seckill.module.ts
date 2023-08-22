import { Module } from '@nestjs/common';
import { SeckillService } from './seckill.service';
import { SeckillController } from './seckill.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seckill } from './seckill.entity';
import { SeckillPeriod } from './seckill-period.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Seckill, SeckillPeriod])],
	providers: [SeckillService],
	controllers: [SeckillController],
})
export class SeckillModule {}
