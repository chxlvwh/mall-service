import { BadRequestException, Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query } from '@nestjs/common';
import { BrandService } from './brand.service';
import { SearchBrandDto } from './dto/search-brand.dto';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Controller('brand')
export class BrandController {
	constructor(private brandService: BrandService) {}

	@Get('list')
	findAll(@Query() searchBrandDto: SearchBrandDto) {
		return this.brandService.findAll(searchBrandDto);
	}

	@Get(':id')
	findOne(@Param() param: { id: string }) {
		return this.brandService.findOne(param.id);
	}

	@Post()
	create(@Body() createBrandDto: CreateBrandDto) {
		return this.brandService.createBrand(createBrandDto);
	}

	@Put(':id')
	update(@Param() param: { id: string }, @Body() updateBrandDto: UpdateBrandDto) {
		const { name } = updateBrandDto;
		if (name === '') throw new BadRequestException('品牌名称不能为空');
		return this.brandService.updateBrand(param.id, updateBrandDto);
	}

	@Delete(':id')
	@HttpCode(204)
	remove(@Param() params: { id: string }) {
		return this.brandService.removeBrand(params.id);
	}
}
