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
	async updateProductCategory(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateProductCategoryDto) {
		return await this.productCategoryService.updateProductCategory(id, body);
	}

	@UseGuards(AdminGuard)
	@Delete(':id')
	async deleteProductCategory(@Param('id') id: number) {
		return await this.productCategoryService.deleteProductCategory(id);
	}

	@Put(':id/restore')
	async restore(@Param() param: { id: string }) {
		if (isNaN(Number(param.id))) {
			throw new BadRequestException('请输入正确的id，id为数字格式');
		}
		return this.productCategoryService.restore(Number(param.id));
	}

	@Get(':id')
	async getById(@Param() params: { id: number }) {
		return this.productCategoryService.findOne(params.id);
	}
}
