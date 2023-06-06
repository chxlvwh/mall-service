import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategory } from './product-category.entity';
import { DataSource, Repository } from 'typeorm';
import CreateProductCategoryDto from './dto/create-product-category.dto';
import { SearchProductCategoryDto } from './dto/search-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { conditionUtils, pagingFormat } from '../utils/db.helper';

@Injectable()
export class ProductCategoryService {
	constructor(
		@InjectRepository(ProductCategory)
		private readonly productCategoryRepository: Repository<ProductCategory>,
		private readonly dataSource: DataSource,
	) {}

	async findAll(query: SearchProductCategoryDto) {
		const { name, parentId, pageSize, current } = query;
		const take = pageSize || 10;
		const skip = ((current || 1) - 1) * take;
		const queryBuilder = await this.productCategoryRepository
			.createQueryBuilder('productCategory')
			.leftJoinAndSelect('productCategory.parent', 'parent');
		const queryObj = {
			'productCategory.name': { value: name, isLike: true },
			'parent.id': { value: parentId },
		};
		const queryResult = await conditionUtils(queryBuilder, queryObj).take(take).skip(skip).getManyAndCount();
		return pagingFormat(queryResult, current, pageSize);
	}

	async createProductCategory(createProductCategoryDto: CreateProductCategoryDto) {
		const isExist = await this.productCategoryRepository.findOne({
			where: { name: createProductCategoryDto.name },
		});
		if (isExist) {
			throw new ConflictException('该分类已存在');
		}
		const { name, desc, parentId, icon, order, isActive } = createProductCategoryDto;
		const productCategory = new ProductCategory();
		productCategory.name = name;
		productCategory.desc = desc;
		productCategory.icon = icon;
		productCategory.order = order;
		productCategory.isActive = isActive !== false;
		if (parentId) {
			return this.dataSource.transaction(async (entityManager) => {
				const parentProductCategory = await entityManager.findOne(ProductCategory, { where: { id: parentId } });
				if (!parentProductCategory) {
					throw new BadRequestException('父分类不存在');
				}
				// 先创建自己
				productCategory.parent = parentProductCategory;
				const subProductCategory = await entityManager.save(productCategory);
				// 再创建关联
				await entityManager.save(parentProductCategory);
				return await entityManager.findOne(ProductCategory, {
					where: { id: subProductCategory.id },
					relations: { parent: true },
				});
			});
		} else {
			return await this.productCategoryRepository.save(productCategory);
		}
	}

	async updateProductCategory(id: number, updateProductCategoryDto: UpdateProductCategoryDto) {
		const productCategory = await this.productCategoryRepository.findOneBy({ id });
		if (!productCategory) {
			throw new BadRequestException('该分类不存在');
		}

		const { name, desc, parentId, icon, order, isActive } = updateProductCategoryDto;
		productCategory.name = name;
		productCategory.desc = desc;
		productCategory.icon = icon;
		productCategory.order = order;
		productCategory.isActive = isActive !== false;
		return this.dataSource.transaction(async (entityManager) => {
			if (parentId) {
				const parentProductCategory = await entityManager.findOne(ProductCategory, { where: { id: parentId } });
				if (!parentProductCategory) {
					throw new BadRequestException('父分类不存在');
				}
				productCategory.parent = parentProductCategory;
				await entityManager.save(productCategory);
				await entityManager.save(parentProductCategory);
			}
			return await entityManager.findOne(ProductCategory, { where: { id }, relations: { parent: true } });
		});
	}

	async deleteProductCategory(id: number) {
		const productCategory = await this.productCategoryRepository.findOne({
			where: { id },
			relations: { parent: true },
		});
		if (!productCategory) {
			throw new BadRequestException('该分类不存在');
		}
		return this.dataSource.transaction(async (entityManager) => {
			await entityManager.softDelete(ProductCategory, { id });
		});
	}

	async restore(id: number) {
		await this.productCategoryRepository.restore(id);
		return await this.productCategoryRepository.findOne({
			where: { id },
			relations: { parent: true, children: true },
		});
	}
}
