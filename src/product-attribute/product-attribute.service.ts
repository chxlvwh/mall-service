import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductAttribute } from './product-attribute.entity';
import { SearchProductAttribute } from './dto/search-product-attribute';
import { formatPageProps, PaginationProps } from '../utils/common';
import { conditionUtils, pagingFormat } from '../utils/db.helper';
import { CreateProductAttribute } from './dto/create-product-attribute';

@Injectable()
export class ProductAttributeService {
	constructor(
		@InjectRepository(ProductAttribute)
		private readonly productAttributeRepository: Repository<ProductAttribute>,
	) {}

	async findAll(query: SearchProductAttribute & PaginationProps) {
		const { name, isRequired, entryMethod, type, canSearch, pageSize, current } = query;
		const { take, skip } = formatPageProps(current, pageSize);
		const queryBuilder = this.productAttributeRepository.createQueryBuilder('attribute');
		const queryObj = {
			'attribute.name': { value: name, isLike: true },
			'attribute.isRequired': { value: isRequired },
			'attribute.entryMethod': { value: entryMethod },
			'attribute.type': { value: type },
			'attribute.canSearch': { value: canSearch },
		};
		const result = await conditionUtils(queryBuilder, queryObj).skip(skip).take(take).getManyAndCount();
		return pagingFormat(result, current, pageSize);
	}

	async create(body: CreateProductAttribute) {
		const attr = this.productAttributeRepository.create(body);
		attr.canSearch = !!body.canSearch;
		attr.isRequired = !!body.isRequired;
		return await this.productAttributeRepository.save(attr);
	}
}
