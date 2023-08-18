import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { formatPageProps } from '../utils/common';
import { conditionUtils, pagingFormat } from '../utils/db.helper';
import { RecommendNew } from './recommend-new.entity';
import { Product } from '../product/entity/product.entity';
import { SearchRecommendNewDto } from './dto/search-recommend-new.dto';
import { UpdateRecommendNewDto } from './dto/update-recommend-new.dto';

@Injectable()
export class RecommendNewService {
	constructor(
		@InjectRepository(RecommendNew) private readonly recommendNewRepository: Repository<RecommendNew>,
		@InjectRepository(Product) private readonly productRepository: Repository<Product>,
	) {}

	async findAll(searchRecommendNewDto: SearchRecommendNewDto) {
		const { productName, isRecommend, pageSize, sortBy, sortOrder, current } = searchRecommendNewDto;
		const { take, skip } = formatPageProps(current, pageSize);
		const queryBuilder = this.recommendNewRepository.createQueryBuilder('recommendNew');
		queryBuilder.leftJoinAndSelect('recommendNew.product', 'product');
		const queryObj = {
			'product.name': { value: productName, isLike: true },
			'recommendNew.isRecommend': { value: isRecommend },
		};
		const queryResult = await conditionUtils(queryBuilder, queryObj)
			.take(take)
			.skip(skip)
			.orderBy(`recommendNew.${sortBy || 'sort'}`, sortOrder || 'DESC')
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
			const recommendNew = new RecommendNew();
			const product = await this.productRepository.findOne({ where: { id: productIds[i] } });
			if (!product) {
				throw new Error('product not found');
			}
			recommendNew.product = product;
			recommendNew.isRecommend = true;
			recommendNew.sort = 100;
			await this.recommendNewRepository.save(recommendNew);
		}
	}

	async update(id: number, body: UpdateRecommendNewDto) {
		const recommendNew = await this.recommendNewRepository.findOne({ where: { id } });
		if (!recommendNew) {
			throw new Error('RecommendProduct not found');
		}
		const newRecommendProduct = { ...recommendNew, ...body, isRecommend: !!body.isRecommend };
		await this.recommendNewRepository.update(id, newRecommendProduct);
	}

	async remove(id: number) {
		const recommendNew = await this.recommendNewRepository.findOne({ where: { id } });
		if (!recommendNew) {
			throw new Error('RecommendProduct not found');
		}
		await this.recommendNewRepository.remove(recommendNew);
		return true;
	}

	async getByProductIds(productIds: number[]) {
		const queryBuilder = this.recommendNewRepository
			.createQueryBuilder('recommendNew')
			.leftJoinAndSelect('recommendNew.product', 'product')
			.where('product.id IN (:...productIds)', { productIds });
		return await queryBuilder.getMany();
	}
}
