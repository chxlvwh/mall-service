import { BadRequestException, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Product } from './entity/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { BrandService } from '../brand/brand.service';
import { ProductCategoryService } from '../product-category/product-category.service';
import { Sku } from './entity/sku.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { formatPageProps } from '../utils/common';
import { conditionUtils, pagingFormat } from '../utils/db.helper';

@Injectable()
export class ProductService {
	constructor(
		@InjectRepository(Product)
		private readonly productRepository: Repository<Product>,
		@InjectRepository(Sku)
		private readonly skuRepository: Repository<Sku>,
		private readonly brandService: BrandService,
		private readonly productCategoryService: ProductCategoryService,
	) {}

	async create(body: CreateProductDto) {
		const { brandId, productCategoryId, skus, coverUrls } = body;
		if (!Array.isArray(coverUrls)) {
			throw new BadRequestException('CoverUrls must be an array');
		}
		if (!coverUrls.length) {
			throw new BadRequestException('CoverUrls can not be empty');
		}
		if (coverUrls.length > 5) {
			throw new BadRequestException('CoverUrls can not be more than 5');
		}
		const brand = await this.brandService.findOne(brandId);
		const productCategory = await this.productCategoryService.findOne(productCategoryId);
		// 验证存在
		if (!brand) {
			throw new Error('Brand not found');
		}
		if (!productCategory) {
			throw new Error('Product category not found');
		}
		const product = this.productRepository.create(body);
		if (skus && skus.length) {
			product.skus = skus.map((it) => {
				const sku = new Sku();
				sku.price = it.price;
				sku.stock = it.stock;
				sku.props = it.props;
				sku.product = product;
				return sku;
			});
		}
		// 保存产品和sku关联表（一对多）
		await this.productRepository.save(product);
		await this.skuRepository.save(product.skus);

		// 保存多对多关联表
		const qb = this.productRepository.createQueryBuilder('product');
		await qb.relation('brand').of(product).add(brand);
		await qb.relation('productCategory').of(product).add(productCategory);
		await qb.execute();
		const result = await this.productRepository.findOne({
			where: { id: product.id },
			relations: { brand: true, productCategory: true, skus: true },
		});

		result.brand = result.brand[0] || {};
		result.productCategory = result.productCategory[0] || {};

		return result;
	}

	async findOne(id: number) {
		const result = await this.productRepository.findOne({
			where: { id },
			relations: { brand: true, productCategory: true, skus: true },
		});
		if (!result) {
			throw new Error('Product not found');
		} else {
			return {
				...result,
				productCategory: result.productCategory[0] || {},
				brand: result.brand[0] || {},
			};
		}
	}

	async update(id: number, body: UpdateProductDto) {
		const product = await this.findOne(id);
		if (!product) {
			throw new Error('Product not found');
		}
		const { brandId, productCategoryId, skus = [] } = body;
		const brand = await this.brandService.findOne(brandId);
		const productCategory = await this.productCategoryService.findOne(productCategoryId);
		// 验证存在
		if (!brand) {
			throw new Error('Brand not found');
		}
		if (!productCategory) {
			throw new Error('Product category not found');
		}
		const newProduct = { ...product, ...body, skus: null };

		// 删除不再使用的sku
		const oldSkus = await this.skuRepository.find({ where: { product: { id } } });
		if (oldSkus.length) {
			for (let i = 0; i < oldSkus.length; i++) {
				await this.skuRepository.remove(oldSkus[i]);
			}
		}
		await this.productRepository.save(newProduct);

		// 保存sku
		if (skus.length) {
			for (let i = 0; i < skus.length; i++) {
				const sku = this.skuRepository.create(skus[i]);
				sku.product = product;
				await this.skuRepository.save(sku);
			}
		}

		const qb = this.productRepository.createQueryBuilder('product');
		await qb.relation('brand').of(product).addAndRemove([brand], product.brand);
		await qb.relation('productCategory').of(product).addAndRemove([productCategory], product.productCategory);
		await qb.execute();
		return true;
	}

	async remove(id: number) {
		const product = await this.findOne(id);
		if (!product) {
			throw new Error('Product not found');
		}
		await this.productRepository.softRemove(product);
		return true;
	}

	async shelf(id: number, status: number) {
		const product = await this.findOne(id);
		if (!product) {
			throw new Error('Product not found');
		}
		product.status = status;
		await this.productRepository.save(product);
		return true;
	}

	async findAll(query: SearchProductDto) {
		const { name, status, itemNo, brandId, productCategoryId, current, pageSize, sortBy, sortOrder } = query;
		const { take, skip } = formatPageProps(current, pageSize);
		const queryBuilder = this.productRepository
			.createQueryBuilder('product')
			.leftJoinAndSelect('product.brand', 'brand')
			.leftJoinAndSelect('product.productCategory', 'productCategory')
			.leftJoinAndSelect('product.skus', 'skus');
		const queryObj = {
			'product.name': { value: name, isLike: true },
			'product.itemNo': { value: itemNo },
			'product.status': { value: status },
			'brand.id': { value: brandId },
			'productCategory.id': { value: productCategoryId },
		};
		const queryResult = await conditionUtils(queryBuilder, queryObj)
			.take(take)
			.skip(skip)
			.orderBy(`product.${sortBy || 'createdAt'}`, sortOrder || 'DESC')
			.getManyAndCount();
		const elements = queryResult[0];
		elements.forEach((product) => {
			product.brand = product.brand[0] || {};
			product.productCategory = product.productCategory[0] || {};
		});
		return pagingFormat(queryResult, current, pageSize);
	}

	async findByIds(ids: number[]) {
		if (!ids.length) {
			return [];
		}
		return await this.productRepository.findBy({ id: In(ids) });
	}
}
