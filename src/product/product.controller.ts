import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../guards/jwt.guard';
import { AdminGuard } from '../guards/admin.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

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
}
