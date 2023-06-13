import { Module } from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { ProductCategoryController } from './product-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategory } from './product-category.entity';
import { ProductAttributeModule } from '../product-attribute/product-attribute.module';
import { ProductAttribute } from '../product-attribute/product-attribute.entity';

@Module({
	imports: [TypeOrmModule.forFeature([ProductCategory, ProductAttribute]), ProductAttributeModule],
	providers: [ProductCategoryService],
	controllers: [ProductCategoryController],
	exports: [ProductCategoryService],
})
export class ProductCategoryModule {}
