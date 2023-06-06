// 生成一个product的实体类
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
	JoinColumn,
} from 'typeorm';

import { Brand } from '../brand/brand.entity';
import { ProductCategory } from '../product-category/product-category.entity';

@Entity()
export class Product {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	subtitle: string;

	@Column({ nullable: true })
	desc: string;

	@Column({ name: 'origin_price' })
	originPrice: number;

	@Column({ name: 'sale_price' })
	salePrice: number;

	@Column({ default: 0 })
	stock: number;

	@Column({ nullable: true })
	units: string;

	@Column({ name: 'is_sale' })
	weight: number;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'last_modified_at' })
	lastModifiedAt: Date;

	@ManyToOne(() => Brand, (brand) => brand.products)
	@JoinColumn({ name: 'brand_id' })
	brand: Brand;

	@ManyToOne(() => ProductCategory, (productCategory) => productCategory.products)
	@JoinColumn({ name: 'product_category_id' })
	productCategory: ProductCategory;
}
