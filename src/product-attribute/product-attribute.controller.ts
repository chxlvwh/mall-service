import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { ProductAttributeService } from './product-attribute.service';
import { CreateProductAttribute } from './dto/create-product-attribute';
import { JwtGuard } from '../guards/jwt.guard';
import { AdminGuard } from '../guards/admin.guard';

@ApiTags('Product Attribute')
@Controller('product-attribute')
@UseGuards(JwtGuard, AdminGuard)
export class ProductAttributeController {
	constructor(private readonly productAttributeService: ProductAttributeService) {}

	@ApiProperty()
	@Post()
	async create(@Body() body: CreateProductAttribute) {
		return await this.productAttributeService.create(body);
	}
}
