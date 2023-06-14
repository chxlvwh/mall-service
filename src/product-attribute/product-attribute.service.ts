import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductAttribute } from './product-attribute.entity';
import { SearchProductAttributeDto } from './dto/search-product-attribute.dto';
import { formatPageProps, PaginationProps } from '../utils/common';
import { conditionUtils, pagingFormat } from '../utils/db.helper';
import { CreateProductAttributeDto } from './dto/create-product-attribute.dto';
import { UpdateProductAttributeDto } from './dto/update-product-attribute.dto';

@Injectable()
export class ProductAttributeService {
	constructor(
		@InjectRepository(ProductAttribute)
		private readonly productAttributeRepository: Repository<ProductAttribute>,
	) {}

	async findAll(query: SearchProductAttributeDto & PaginationProps) {
		const { name, isRequired, entryMethod, type, canSearch, pageSize = 20, current = 1 } = query;
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

	async findOne(id: number) {
		return await this.productAttributeRepository.findOne({ where: { id } });
	}

	async create(body: CreateProductAttributeDto) {
		const isExist = await this.productAttributeRepository.findOne({ where: { name: body.name } });
		if (isExist) {
			throw new ConflictException('属性名已存在');
		}
		return await this.productAttributeRepository.save(body);
	}

	async update(id: number, body: UpdateProductAttributeDto) {
		const oldAttr = await this.findOne(id);
		if (!oldAttr) {
			throw new NotFoundException('分类不存在');
		}
		await this.productAttributeRepository.save({ id, ...body });
		return await this.findOne(id);
	}

	async delete(id: number) {
		const oldAttr = await this.findOne(id);
		if (!oldAttr) {
			throw new NotFoundException('分类不存在');
		}
		const relations = await this.productAttributeRepository
			.createQueryBuilder('attr')
			.relation(ProductAttribute, 'productCategory')
			.of(id)
			.loadMany();
		if (relations.length) {
			throw new ConflictException('该属性已被分类使用，无法删除');
		}
		return await this.productAttributeRepository.softDelete(id);
	}

	async restore(id: number) {
		await this.productAttributeRepository.restore(id);
		return this.findOne(id);
	}

	async findByIds(ids: number[]) {
		return await this.productAttributeRepository.createQueryBuilder('attribute').whereInIds(ids).getMany();
	}
}
