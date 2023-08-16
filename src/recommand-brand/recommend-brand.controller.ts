import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { RecommendBrandService } from './recommend-brand.service';
import { SearchRecommendBrandDto } from './dto/search-recommend-brand.dto';
import { UpdateRecommendBrandDto } from './dto/update-recommend-brand.dto';

@Controller('recommend-brand')
export class RecommendBrandController {
	constructor(private readonly recommendBrandService: RecommendBrandService) {}
	@Get()
	async findAll(@Query() searchRecommendBrandDto: SearchRecommendBrandDto) {
		return await this.recommendBrandService.findAll(searchRecommendBrandDto);
	}

	@Post()
	async create(@Body('brandIds') brandIds: number[]) {
		return await this.recommendBrandService.create(brandIds);
	}

	@Put(':id')
	async update(@Param('id') id: number, @Body() body: UpdateRecommendBrandDto) {
		return await this.recommendBrandService.update(id, body);
	}

	@Delete(':id')
	async remove(@Query('id') id: number) {
		return await this.recommendBrandService.remove(id);
	}

	@Get('getByBrandIds')
	async getByBrandIds(@Query('brandIds') brandIds: number[]) {
		return await this.recommendBrandService.getByBrandIds(brandIds);
	}
}
