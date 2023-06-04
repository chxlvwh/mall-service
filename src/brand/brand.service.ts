import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Brand } from './brand.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { SearchBrandDto } from './dto/search-brand.dto';
import { conditionUtils, pagingFormat } from '../utils/db.helper';

@Injectable()
export class BrandService {
	constructor(
		@InjectRepository(Brand)
		private readonly brandRepository: Repository<Brand>,
	) {}

	async findAll(searchBrandDto: SearchBrandDto) {
		const { name, current, pageSize } = searchBrandDto;
		const take = pageSize || 10;
		const skip = ((current || 1) - 1) * take;
		const queryBuilder = await this.brandRepository.createQueryBuilder('brand');
		const obj = {
			'brand.name': { value: name, isLike: true },
		};
		const result = await conditionUtils(queryBuilder, obj).take(take).skip(skip).getManyAndCount();
		return pagingFormat(result, current, pageSize);
	}

	findOne(id: string | number) {
		return this.brandRepository.findOne({ where: { id: Number(id) } });
	}

	createBrand(createBrandDto: CreateBrandDto) {
		return this.brandRepository.save(createBrandDto);
	}

	async updateBrand(id: string, updateBrandDto: UpdateBrandDto) {
		await this.brandRepository.update(id, updateBrandDto);
		return this.findOne(id);
	}

	removeBrand(id: string) {
		return this.brandRepository.delete(id);
	}
}
