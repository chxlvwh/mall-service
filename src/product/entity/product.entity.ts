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
	ManyToOne,
	JoinColumn,
	OneToOne,
} from 'typeorm';

import { Brand } from '../../brand/brand.entity';
import { ProductCategory } from '../../product-category/product-category.entity';
import { Sku } from './sku.entity';
import { ApiProperty } from '@nestjs/swagger';
import { OrderItem } from '../../order/entity/order-item.entity';
import { Coupon } from '../../coupon/entity/coupon.entity';
import { Comment } from '../../comment/comment.entity';
import { RecommendNew } from '../../recommend-new/recommend-new.entity';
import { SeckillPeriod } from '../../seckill/entity/seckill-period.entity';
import { PeriodProduct } from '../../seckill/entity/period-product.entity';

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

	@ApiProperty({ description: '主图数组' })
	@Column({ type: 'json', name: 'cover_urls' })
	coverUrls: JSON;

	@ApiProperty({ description: '首图' })
	@Column()
	cover: string;

	@ApiProperty({ description: '详情页内容' })
	@Column({ type: 'text' })
	content: string;

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

	@Column({ nullable: true })
	sales: number;

	@OneToMany(() => Comment, (comment) => comment.product)
	comments: Comment[];

	@ApiProperty({ description: 'id: 属性id, name:属性名，value:属性值' })
	@Column({ type: 'json', nullable: true })
	props: JSON;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'last_modified_at' })
	lastModifiedAt: Date;

	@DeleteDateColumn({ name: 'deleted_at' })
	deletedAt: Date;

	@ManyToOne(() => Brand, (brand) => brand.products)
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

	@OneToMany(() => OrderItem, (orderItem) => orderItem.product)
	@JoinColumn({ name: 'order_item_id' })
	orderItem: OrderItem[];

	// 关联优惠券
	@ManyToMany(() => Coupon, (coupon) => coupon.products)
	coupons: Coupon[];

	@OneToOne(() => RecommendNew, (recommendNew) => recommendNew.product)
	recommendNew: RecommendNew;

	@OneToMany(() => PeriodProduct, (periodProduct) => periodProduct.product)
	periodProduct: PeriodProduct[];
}
