import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { BrandService } from '../brand/brand.service';
import { ProductCategoryService } from '../product-category/product-category.service';
import { Sku } from './sku.entity';
import { UpdateProductDto } from './dto/update-product.dto';

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
		const { brandId, productCategoryId, skus } = body;
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
		return await this.productRepository.findOne({
			where: { id: product.id },
			relations: { brand: true, productCategory: true, skus: true },
		});
	}

	async findOne(id: number) {
		return await this.productRepository.findOne({
			where: { id },
			relations: { brand: true, productCategory: true, skus: true },
		});
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
		const newProduct = { ...product, ...body };
		await this.productRepository.save(newProduct);

		// 保存sku
		if (skus.length) {
			// 保存新增的sku
			const newSkus = skus.filter((it) => !it.id);
			await this.skuRepository.save(newSkus);
			// 保存修改的sku
			for (let i = 0; i < skus.length; i++) {
				const it = skus[i];
				const sku = await this.skuRepository.findOne({ where: { id: it.id } });
				if (!sku) {
					continue;
				}
				sku.price = it.price;
				sku.stock = it.stock;
				sku.props = it.props;
				sku.product = product;
				await this.skuRepository.save(sku);
			}
		}
		// 删除不再使用的sku
		const oldRelationSkus = await this.skuRepository.find({ where: { product: { id } } });
		const oldSkus = oldRelationSkus.filter((it) => !skus.find((sku) => sku.id === it.id));
		await this.skuRepository.remove(oldSkus);

		const qb = this.productRepository.createQueryBuilder('product');
		await qb.relation('brand').of(product).addAndRemove([brand], product.brand);
		await qb.relation('productCategory').of(product).addAndRemove([productCategory], product.productCategory);
		await qb.execute();
	}
}
