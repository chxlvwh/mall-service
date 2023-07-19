import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../guards/jwt.guard';
import { AdminGuard } from '../guards/admin.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { Product } from './entity/product.entity';

@ApiTags('Product')
@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@ApiProperty()
	@Get('')
	async findAll(@Query() query: SearchProductDto) {
		return await this.productService.findAll(query);
	}

	@ApiProperty()
	@UseGuards(JwtGuard, AdminGuard)
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
	@UseGuards(JwtGuard, AdminGuard)
	@Put(':id/status/on-sale')
	async onSale(@Param('id', ParseIntPipe) id: number) {
		return await this.productService.shelf(id, 1);
	}

	@ApiProperty()
	@UseGuards(JwtGuard, AdminGuard)
	@Put(':id/status/off-sale')
	async offSale(@Param('id', ParseIntPipe) id: number) {
		return await this.productService.shelf(id, 0);
	}

	@ApiProperty()
	@UseGuards(JwtGuard, AdminGuard)
	@Put(':id')
	async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateProductDto) {
		return await this.productService.update(id, body);
	}

	@ApiProperty()
	@UseGuards(JwtGuard, AdminGuard)
	@Delete(':id')
	async remove(@Param('id', ParseIntPipe) id: number) {
		return await this.productService.remove(id);
	}
}
