import { Module } from '@nestjs/common';
import { RecommendPopularService } from './recommend-popular.service';
import { RecommendPopularController } from './recommend-popular.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecommendPopular } from './recommend-popular.entity';
import { Product } from '../product/entity/product.entity';

@Module({
	imports: [TypeOrmModule.forFeature([RecommendPopular, Product])],
	providers: [RecommendPopularService],
	controllers: [RecommendPopularController],
})
export class RecommendPopularModule {}
