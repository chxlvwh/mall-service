import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Put,
	Query,
	UseGuards,
} from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { SearchProductCategoryDto } from './dto/search-product-category.dto';
import CreateProductCategoryDto from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { AdminGuard } from '../guards/admin.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('Product Category')
@Controller('product-category')
export class ProductCategoryController {
	constructor(private readonly productCategoryService: ProductCategoryService) {}

	@Get('')
	async findAll(@Query() query: SearchProductCategoryDto) {
		return await this.productCategoryService.findAll(query);
	}

	@ApiProperty()
	@Get(':id/attributes')
	async getAttrs(@Param('id', ParseIntPipe) id: number) {
		return await this.productCategoryService.getAttrs(id);
	}

	@Get('tree')
	async findTrees() {
		return await this.productCategoryService.findTrees();
	}

	@Get('tree/ancestors/:id')
	async findAncestors(@Param('id', ParseIntPipe) id: number) {
		return await this.productCategoryService.findAncestors(id);
	}

	@UseGuards(JwtGuard, AdminGuard)
	@Post()
	async createProductCategory(@Body() body: CreateProductCategoryDto) {
		return await this.productCategoryService.createProductCategory(body);
	}

	@UseGuards(JwtGuard, AdminGuard)
	@Put(':id/attributes')
	async updateProductCategoryAttrs(@Param('id', ParseIntPipe) id: number, @Body() body: { attributeIds: number[] }) {
		return await this.productCategoryService.updateProductCategoryAttrs(id, body);
	}

	@UseGuards(JwtGuard, AdminGuard)
	@Put(':id')
	async updateProductCategory(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateProductCategoryDto) {
		return await this.productCategoryService.updateProductCategory(id, body);
	}

	@UseGuards(JwtGuard, AdminGuard)
	@Delete(':id')
	async deleteProductCategory(@Param('id') id: number) {
		return await this.productCategoryService.deleteProductCategory(id);
	}

	@UseGuards(JwtGuard, AdminGuard)
	@Put(':id/restore')
	async restore(@Param('id', ParseIntPipe) id: number) {
		if (isNaN(Number(id))) {
			throw new BadRequestException('请输入正确的id，id为数字格式');
		}
		return this.productCategoryService.restore(Number(id));
	}

	@Get(':id')
	async getById(@Param('id', ParseIntPipe) id: number) {
		return this.productCategoryService.findOne(id);
	}
}
