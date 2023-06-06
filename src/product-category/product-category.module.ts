import { Module } from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { ProductCategoryController } from './product-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategory } from './product-category.entity';

@Module({
	imports: [TypeOrmModule.forFeature([ProductCategory])],
	providers: [ProductCategoryService],
	controllers: [ProductCategoryController],
	exports: [ProductCategoryService],
})
export class ProductCategoryModule {}
