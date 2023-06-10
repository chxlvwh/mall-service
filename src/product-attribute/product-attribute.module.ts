import { Module } from '@nestjs/common';
import { ProductAttributeService } from './product-attribute.service';
import { ProductAttributeController } from './product-attribute.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAttribute } from './product-attribute.entity';

@Module({
	imports: [TypeOrmModule.forFeature([ProductAttribute])],
	providers: [ProductAttributeService],
	controllers: [ProductAttributeController],
	exports: [ProductAttributeService],
})
export class ProductAttributeModule {}
