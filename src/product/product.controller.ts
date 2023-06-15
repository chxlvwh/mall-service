import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../guards/jwt.guard';
import { AdminGuard } from '../guards/admin.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Product')
@UseGuards(JwtGuard, AdminGuard)
@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@ApiProperty()
	@Post()
	async create(@Body() body: CreateProductDto) {
		return await this.productService.create(body);
	}

	@ApiProperty()
	@Get(':id')
	async findOne(@Param('id') id: number) {
		return await this.productService.findOne(id);
	}

	@ApiProperty()
	@Put(':id')
	async update(@Param('id') id: number, @Body() body: UpdateProductDto) {
		return await this.productService.update(id, body);
	}
}
