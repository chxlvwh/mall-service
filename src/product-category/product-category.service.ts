import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategory } from './product-category.entity';
import { TreeRepository } from 'typeorm';
import CreateProductCategoryDto from './dto/create-product-category.dto';
import { SearchProductCategoryDto } from './dto/search-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { conditionUtils, pagingFormat } from '../utils/db.helper';
import { ProductAttribute } from '../product-attribute/product-attribute.entity';
import { ProductAttributeService } from '../product-attribute/product-attribute.service';

@Injectable()
export class ProductCategoryService {
	constructor(
		@InjectRepository(ProductCategory)
		private readonly productCategoryRepository: TreeRepository<ProductCategory>,
		@InjectRepository(ProductAttribute)
		private readonly productAttributeService: ProductAttributeService,
	) {}

	async findTrees() {
		return await this.productCategoryRepository.findTrees();
	}

	async findAncestors(id: number) {
		const category = await this.findOne(id);
		return await this.productCategoryRepository.findAncestors(category);
	}

	async getAttrs(id: number) {
		const category = await this.findOne(id);
		return category.productAttributes;
	}

	async findAll(query: SearchProductCategoryDto) {
		const { name, parentId, pageSize, current, isActive } = query;
		const take = pageSize || 10;
		const skip = ((current || 1) - 1) * take;
		const queryBuilder = await this.productCategoryRepository
			.createQueryBuilder('productCategory')
			.leftJoinAndSelect('productCategory.parent', 'parent')
			.leftJoinAndSelect('productCategory.children', 'children')
			.leftJoinAndSelect('productCategory.productAttributes', 'attributes');
		if (!parentId) {
			queryBuilder.where('productCategory.parent IS NULL');
		}
		const queryObj = {
			'productCategory.name': { value: name, isLike: true },
			'productCategory.isActive': { value: isActive },
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
			const parentProductCategory = await this.productCategoryRepository.findOne({ where: { id: parentId } });
			if (!parentProductCategory) {
				throw new BadRequestException('父分类不存在');
			}
			productCategory.parent = parentProductCategory;
			const subProductCategory = await this.productCategoryRepository.save(productCategory);
			return await this.productCategoryRepository.findOne({
				where: { id: subProductCategory.id },
				relations: { parent: true },
			});
		} else {
			return await this.productCategoryRepository.save(productCategory);
		}
	}

	async updateProductCategory(id: number, updateProductCategoryDto: UpdateProductCategoryDto) {
		const productCategory = await this.productCategoryRepository.findOne({
			where: { id },
			relations: { parent: true },
		});
		if (!productCategory) {
			throw new BadRequestException('该分类不存在');
		}

		const { name, desc, parentId, icon, order, isActive } = updateProductCategoryDto;
		productCategory.name = name;
		productCategory.desc = desc;
		productCategory.icon = icon;
		productCategory.order = order;
		productCategory.isActive = isActive !== false;
		if (parentId) {
			if (productCategory.id === parentId) {
				throw new BadRequestException('上级分类不能是自己');
			}
			const parentProductCategory = await this.productCategoryRepository.findOne({ where: { id: parentId } });
			if (!parentProductCategory) {
				throw new BadRequestException('父分类不存在');
			}
			productCategory.parent = parentProductCategory;
			await this.productCategoryRepository.save(productCategory);
			return await this.productCategoryRepository.findOne({ where: { id }, relations: { parent: true } });
		} else {
			return await this.productCategoryRepository.save(productCategory);
		}
	}

	async updateProductCategoryAttrs(id: number, attrs: { attributeIds: number[] }) {
		const productCategory = await this.productCategoryRepository.findOne({
			where: { id },
			relations: { productAttributes: true },
		});
		if (!productCategory) {
			throw new BadRequestException('该分类不存在');
		}
		const oldAttrIds = productCategory.productAttributes.map((attr) => attr.id);
		productCategory.productAttributes = await this.productAttributeService.findByIds(attrs.attributeIds);
		const qb = this.productCategoryRepository.createQueryBuilder('productCategory');
		await qb.relation('productAttributes').of(productCategory).addAndRemove(attrs.attributeIds, oldAttrIds);
		await qb.execute();
		return true;
	}

	async deleteProductCategory(id: number) {
		const productCategory = await this.productCategoryRepository.findOne({
			where: { id },
			relations: { parent: true },
		});
		if (!productCategory) {
			throw new BadRequestException('该分类不存在');
		}
		return this.productCategoryRepository.softDelete(id);
	}

	async restore(id: number) {
		await this.productCategoryRepository.restore(id);
		return this.findOne(id);
	}

	async findOne(id: number) {
		return this.productCategoryRepository.findOne({
			where: { id },
			relations: { parent: true, children: true, productAttributes: true },
		});
	}
}
