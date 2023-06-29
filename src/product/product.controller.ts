import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../guards/jwt.guard';
import { AdminGuard } from '../guards/admin.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchProductDto } from './dto/search-product.dto';

@ApiTags('Product')
@UseGuards(JwtGuard, AdminGuard)
@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@ApiProperty()
	@Get('list')
	async findAll(@Query() query: SearchProductDto) {
		return await this.productService.findAll(query);
	}

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
	@Put(':id/status/on-sale')
	async onSale(@Param('id', ParseIntPipe) id: number) {
		return await this.productService.shelf(id, 1);
	}

	@ApiProperty()
	@Put(':id/status/off-sale')
	async offSale(@Param('id', ParseIntPipe) id: number) {
		return await this.productService.shelf(id, 0);
	}

	@ApiProperty()
	@Put(':id')
	async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateProductDto) {
		return await this.productService.update(id, body);
	}

	@ApiProperty()
	@Delete(':id')
	async remove(@Param('id', ParseIntPipe) id: number) {
		return await this.productService.remove(id);
	}
}
