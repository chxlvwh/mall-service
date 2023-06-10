import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	ParseIntPipe,
	Post,
	Put,
	Query,
} from '@nestjs/common';
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
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.brandService.findOne(id);
	}

	@Post()
	create(@Body() createBrandDto: CreateBrandDto) {
		return this.brandService.createBrand(createBrandDto);
	}

	@Put(':id')
	update(@Param('id', ParseIntPipe) id: number, @Body() updateBrandDto: UpdateBrandDto) {
		const { name } = updateBrandDto;
		if (name === '') throw new BadRequestException('品牌名称不能为空');
		return this.brandService.updateBrand(id, updateBrandDto);
	}

	@Delete(':id')
	@HttpCode(204)
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.brandService.removeBrand(id);
	}
}
