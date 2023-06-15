import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { BrandService } from '../brand/brand.service';
import { ProductCategoryService } from '../product-category/product-category.service';
import { Sku } from './sku.entity';

@Injectable()
export class ProductService {
	constructor(
		@InjectRepository(Product)
		private readonly productRepository: Repository<Product>,
		@InjectRepository(Sku)
		private readonly skuRepository: Repository<Sku>,
		private readonly brandService: BrandService,
		private readonly productCategoryService: ProductCategoryService,
		private readonly dataSource: DataSource,
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
}
