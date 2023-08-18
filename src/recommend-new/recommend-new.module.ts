import { Module } from '@nestjs/common';
import { RecommendNewController } from './recommend-new.controller';
import { RecommendNewService } from './recommend-new.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecommendNew } from './recommend-new.entity';
import { Product } from '../product/entity/product.entity';

@Module({
	imports: [TypeOrmModule.forFeature([RecommendNew, Product])],
	controllers: [RecommendNewController],
	providers: [RecommendNewService],
})
export class RecommendNewModule {}
