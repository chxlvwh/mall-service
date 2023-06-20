// 生成一个product的实体类
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
	ManyToMany,
	JoinTable,
	DeleteDateColumn,
} from 'typeorm';

import { Brand } from '../brand/brand.entity';
import { ProductCategory } from '../product-category/product-category.entity';
import { Sku } from './sku.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum ProductStatus {
	OFF_SHELF = 0,
	ON_SHELF = 1,
}

@Entity()
export class Product {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column({ nullable: true })
	subtitle: string;

	@Column({ name: 'item_no', nullable: true })
	itemNo: string;

	@Column({ nullable: true })
	introduction: string;

	@Column({ name: 'origin_price' })
	originPrice: number;

	@Column({ name: 'sale_price' })
	salePrice: number;

	@Column({ default: 0 })
	stock: number;

	@Column()
	status: ProductStatus;

	@Column({ nullable: true })
	unit: string;

	@Column({ nullable: true })
	weight: number;

	@ApiProperty({ description: 'id: 属性id, name:属性名，value:属性值' })
	@Column({ type: 'json', nullable: true })
	props: JSON;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'last_modified_at' })
	lastModifiedAt: Date;

	@ManyToMany(() => Brand, (brand) => brand.products)
	@JoinTable({ name: 'brand_product' })
	brand: Brand;

	@ManyToMany(() => ProductCategory, (productCategory) => productCategory.products)
	@JoinTable({
		name: 'category_product',
		joinColumn: { name: 'product_id' },
		inverseJoinColumn: { name: 'product_category_id' },
	})
	productCategory: ProductCategory;

	@OneToMany(() => Sku, (sku) => sku.product)
	skus: Sku[];

	@DeleteDateColumn({ name: 'deleted_at' })
	deletedAt: Date;
}
