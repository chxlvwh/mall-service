import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { RecommendNewService } from './recommend-new.service';
import { SearchRecommendNewDto } from './dto/search-recommend-new.dto';
import { UpdateRecommendNewDto } from './dto/update-recommend-new.dto';

@Controller('recommend-new')
export class RecommendNewController {
	constructor(private readonly recommendNewService: RecommendNewService) {}
	@Get()
	async findAll(@Query() searchRecommendNewDto: SearchRecommendNewDto) {
		return await this.recommendNewService.findAll(searchRecommendNewDto);
	}

	@Post()
	async create(@Body('productIds') productIds: number[]) {
		return await this.recommendNewService.create(productIds);
	}

	@Put(':id')
	async update(@Param('id') id: number, @Body() body: UpdateRecommendNewDto) {
		return await this.recommendNewService.update(id, body);
	}

	@Delete(':id')
	async remove(@Query('id') id: number) {
		return await this.recommendNewService.remove(id);
	}

	@Get('getByProductIds')
	async getByProductIds(@Query('productIds') productIds: number[]) {
		return await this.recommendNewService.getByProductIds(productIds);
	}
}
