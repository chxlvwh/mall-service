import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecommendBrand } from './recommend-brand.entity';
import { SearchRecommendBrandDto } from './dto/search-recommend-brand.dto';
import { formatPageProps } from '../utils/common';
import { Repository } from 'typeorm';
import { conditionUtils, pagingFormat } from '../utils/db.helper';
import { Brand } from '../brand/brand.entity';
import { UpdateRecommendBrandDto } from './dto/update-recommend-brand.dto';

@Injectable()
export class RecommendBrandService {
	constructor(
		@InjectRepository(RecommendBrand) private readonly recommendBrandRepository: Repository<RecommendBrand>,
		@InjectRepository(Brand) private readonly brandRepository: Repository<Brand>,
	) {}

	async findAll(searchRecommendBrandDto: SearchRecommendBrandDto) {
		const { brandName, isRecommend, pageSize, sortBy, sortOrder, current } = searchRecommendBrandDto;
		const { take, skip } = formatPageProps(current, pageSize);
		const queryBuilder = this.recommendBrandRepository.createQueryBuilder('recommendBrand');
		queryBuilder.leftJoinAndSelect('recommendBrand.brand', 'brand');
		const queryObj = {
			'brand.name': { value: brandName, isLike: true },
			'recommendBrand.isRecommend': { value: isRecommend },
		};
		const queryResult = await conditionUtils(queryBuilder, queryObj)
			.take(take)
			.skip(skip)
			.orderBy(`recommendBrand.${sortBy || 'sort'}`, sortOrder || 'DESC')
			.getManyAndCount();
		return pagingFormat(queryResult, current, pageSize);
	}

	async create(brandIds: number[]) {
		if (!brandIds || !brandIds.length) {
			throw new Error('brandIds can not be empty');
		}
		const relatedBrands = await this.getByBrandIds(brandIds);
		const relatedBrandIds = relatedBrands.map((item) => item.brand.id);
		const newBrandIds = brandIds.filter((item) => !relatedBrandIds.includes(item));
		for (let i = 0; i < newBrandIds.length; i++) {
			const recommendBrand = new RecommendBrand();
			const brand = await this.brandRepository.findOne({ where: { id: brandIds[i] } });
			if (!brand) {
				throw new Error('brand not found');
			}
			recommendBrand.brand = brand;
			recommendBrand.isRecommend = true;
			recommendBrand.sort = 100;
			await this.recommendBrandRepository.save(recommendBrand);
		}
	}

	async update(id: number, body: UpdateRecommendBrandDto) {
		const recommendBrand = await this.recommendBrandRepository.findOne({ where: { id } });
		if (!recommendBrand) {
			throw new Error('RecommendBrand not found');
		}
		const newRecommendBrand = { ...recommendBrand, ...body, isRecommend: !!body.isRecommend };
		await this.recommendBrandRepository.update(id, newRecommendBrand);
	}

	async remove(id: number) {
		const recommendBrand = await this.recommendBrandRepository.findOne({ where: { id } });
		if (!recommendBrand) {
			throw new Error('RecommendBrand not found');
		}
		await this.recommendBrandRepository.remove(recommendBrand);
		return true;
	}

	async getByBrandIds(brandIds: number[]) {
		const queryBuilder = this.recommendBrandRepository
			.createQueryBuilder('recommendBrand')
			.leftJoinAndSelect('recommendBrand.brand', 'brand')
			.where('brand.id IN (:...brandIds)', { brandIds });
		return await queryBuilder.getMany();
	}
}
