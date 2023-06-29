import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseBoolPipe,
	ParseIntPipe,
	Post,
	Put,
	Query,
	UseGuards,
} from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { ProductAttributeService } from './product-attribute.service';
import { CreateProductAttributeDto } from './dto/create-product-attribute.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { AdminGuard } from '../guards/admin.guard';
import { UpdateProductAttributeDto } from './dto/update-product-attribute.dto';
import { PaginationProps } from '../utils/common';
import { SearchProductAttributeDto } from './dto/search-product-attribute.dto';

@ApiTags('Product Attribute')
@Controller('product-attribute')
@UseGuards(JwtGuard, AdminGuard)
export class ProductAttributeController {
	constructor(private readonly productAttributeService: ProductAttributeService) {}

	// @ApiProperty()
	@Post()
	async create(@Body() body: CreateProductAttributeDto) {
		return await this.productAttributeService.create(body);
	}

	@ApiProperty()
	@Put(':id')
	async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateProductAttributeDto) {
		return await this.productAttributeService.update(id, body);
	}

	@ApiProperty()
	@Get('list')
	async findAll(
		@Query()
		query: SearchProductAttributeDto,
	) {
		return await this.productAttributeService.findAll(query);
	}

	@ApiProperty()
	@Get(':id')
	async findOne(@Param('id', ParseIntPipe) id: number) {
		return this.productAttributeService.findOne(id);
	}

	@ApiProperty()
	@Delete(':id')
	async delete(@Param('id', ParseIntPipe) id: number) {
		return this.productAttributeService.delete(id);
	}

	@ApiProperty()
	@Put(':id/restore')
	async restore(@Param('id', ParseIntPipe) id: number) {
		return this.productAttributeService.restore(id);
	}
}
