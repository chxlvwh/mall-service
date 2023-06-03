import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BrandService } from './brand.service';
import { SearchBrandDto } from './dto/search-brand.dto';
import { CreateBrandDto } from './dto/create-brand.dto';

@Controller('brand')
export class BrandController {
	constructor(private brandService: BrandService) {}

	@Get('list')
	findAll(@Query() searchBrandDto: SearchBrandDto) {
		return this.brandService.findAll(searchBrandDto);
	}

	@Post()
	create(@Body() createBrandDto: CreateBrandDto) {
		return this.brandService.createBrand(createBrandDto);
	}
}
