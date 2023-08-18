import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecommendPopular } from './recommend-popular.entity';
import { Product } from '../product/entity/product.entity';
import { formatPageProps } from '../utils/common';
import { conditionUtils, pagingFormat } from '../utils/db.helper';
import { SearchRecommendPopularDto } from './dto/search-recommend-popular.dto';
import { UpdateRecommendPopularDto } from './dto/update-recommend-popular.dto';

@Injectable()
export class RecommendPopularService {
	constructor(
		@InjectRepository(RecommendPopular)
		private readonly recommendPopularRepository: Repository<RecommendPopular>,
		@InjectRepository(Product) private readonly productRepository: Repository<Product>,
	) {}

	async findAll(searchRecommendPopularDto: SearchRecommendPopularDto) {
		const { productName, isRecommend, pageSize, sortBy, sortOrder, current } = searchRecommendPopularDto;
		const { take, skip } = formatPageProps(current, pageSize);
		const queryBuilder = this.recommendPopularRepository.createQueryBuilder('recommendPopular');
		queryBuilder.leftJoinAndSelect('recommendPopular.product', 'product');
		const queryObj = {
			'product.name': { value: productName, isLike: true },
			'recommendPopular.isRecommend': { value: isRecommend },
		};
		const queryResult = await conditionUtils(queryBuilder, queryObj)
			.take(take)
			.skip(skip)
			.orderBy(`recommendPopular.${sortBy || 'sort'}`, sortOrder || 'DESC')
			.getManyAndCount();
		return pagingFormat(queryResult, current, pageSize);
	}

	async create(productIds: number[]) {
		if (!productIds || !productIds.length) {
			throw new Error('productIds can not be empty');
		}
		const relatedProducts = await this.getByProductIds(productIds);
		const relatedProductIds = relatedProducts.map((item) => item.product.id);
		const newProductIds = productIds.filter((item) => !relatedProductIds.includes(item));
		for (let i = 0; i < newProductIds.length; i++) {
			const recommendPopular = new RecommendPopular();
			const product = await this.productRepository.findOne({ where: { id: productIds[i] } });
			if (!product) {
				throw new Error('product not found');
			}
			recommendPopular.product = product;
			recommendPopular.isRecommend = true;
			recommendPopular.sort = 100;
			await this.recommendPopularRepository.save(recommendPopular);
		}
	}

	async update(id: number, body: UpdateRecommendPopularDto) {
		const recommendPopular = await this.recommendPopularRepository.findOne({ where: { id } });
		if (!recommendPopular) {
			throw new Error('RecommendProduct not found');
		}
		const newRecommendProduct = { ...recommendPopular, ...body, isRecommend: !!body.isRecommend };
		await this.recommendPopularRepository.update(id, newRecommendProduct);
	}

	async remove(id: number) {
		const recommendPopular = await this.recommendPopularRepository.findOne({ where: { id } });
		if (!recommendPopular) {
			throw new Error('RecommendProduct not found');
		}
		await this.recommendPopularRepository.remove(recommendPopular);
		return true;
	}

	async getByProductIds(productIds: number[]) {
		const queryBuilder = this.recommendPopularRepository
			.createQueryBuilder('recommendPopular')
			.leftJoinAndSelect('recommendPopular.product', 'product')
			.where('product.id IN (:...productIds)', { productIds });
		return await queryBuilder.getMany();
	}
}
