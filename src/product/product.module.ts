import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Sku } from './sku.entity';
import { BrandModule } from '../brand/brand.module';
import { ProductCategoryModule } from '../product-category/product-category.module';

@Module({
	imports: [TypeOrmModule.forFeature([Product, Sku]), BrandModule, ProductCategoryModule],
	providers: [ProductService],
	controllers: [ProductController],
	exports: [ProductService],
})
export class ProductModule {}
