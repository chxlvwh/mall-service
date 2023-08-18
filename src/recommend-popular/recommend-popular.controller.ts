import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { UpdateRecommendBrandDto } from '../recommend-brand/dto/update-recommend-brand.dto';
import { RecommendPopularService } from './recommend-popular.service';
import { SearchRecommendPopularDto } from './dto/search-recommend-popular.dto';
import { UpdateRecommendPopularDto } from './dto/update-recommend-popular.dto';

@Controller('recommend-popular')
export class RecommendPopularController {
	constructor(private readonly recommendPopularService: RecommendPopularService) {}
	@Get()
	async findAll(@Query() searchRecommendPopularDto: SearchRecommendPopularDto) {
		return await this.recommendPopularService.findAll(searchRecommendPopularDto);
	}

	@Post()
	async create(@Body('productIds') productIds: number[]) {
		return await this.recommendPopularService.create(productIds);
	}

	@Put(':id')
	async update(@Param('id') id: number, @Body() body: UpdateRecommendPopularDto) {
		return await this.recommendPopularService.update(id, body);
	}

	@Delete(':id')
	async remove(@Query('id') id: number) {
		return await this.recommendPopularService.remove(id);
	}

	@Get('getByProductIds')
	async getByProductIds(@Query('productIds') productIds: number[]) {
		return await this.recommendPopularService.getByProductIds(productIds);
	}
}
