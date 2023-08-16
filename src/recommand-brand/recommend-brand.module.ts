import { Module } from '@nestjs/common';
import { RecommendBrandController } from './recommend-brand.controller';
import { RecommendBrandService } from './recommend-brand.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecommendBrand } from './recommend-brand.entity';
import { Brand } from '../brand/brand.entity';

@Module({
	imports: [TypeOrmModule.forFeature([RecommendBrand, Brand])],
	controllers: [RecommendBrandController],
	providers: [RecommendBrandService],
})
export class RecommendBrandModule {}
