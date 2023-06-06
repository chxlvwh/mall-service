import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { SearchProductCategoryDto } from './dto/search-product-category.dto';
import CreateProductCategoryDto from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { AdminGuard } from '../guards/admin.guard';
import { JwtGuard } from '../guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('product-category')
export class ProductCategoryController {
	constructor(private readonly productCategoryService: ProductCategoryService) {}

	@Get('list')
	async findAll(@Query() query: SearchProductCategoryDto) {
		return await this.productCategoryService.findAll(query);
	}

	@UseGuards(AdminGuard)
	@Post()
	async createProductCategory(@Body() body: CreateProductCategoryDto) {
		return await this.productCategoryService.createProductCategory(body);
	}

	@UseGuards(AdminGuard)
	@Put(':id')
	async updateProductCategory(@Param('id') id: number, @Body() body: UpdateProductCategoryDto) {
		return await this.productCategoryService.updateProductCategory(id, body);
	}

	@UseGuards(AdminGuard)
	@Delete(':id')
	async deleteProductCategory(@Param('id') id: number) {
		return await this.productCategoryService.deleteProductCategory(id);
	}
}
