import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { CouponItem } from './coupon-item.entity';
import { Product } from '../../product/entity/product.entity';
import { ProductCategory } from '../../product-category/product-category.entity';
import { OrderItem } from '../../order/entity/order-item.entity';
import { Order } from '../../order/entity/order.entity';

export enum CouponType {
	/** 打折 */
	PERCENTAGE = 'PERCENTAGE',
	/** 满减 */
	DISCOUNT_AMOUNT = 'DISCOUNT_AMOUNT',
	/** 直减 */
	PAY_AMOUNT = 'PAY_AMOUNT',
}

export enum CouponStatus {
	/** 未开始 */
	NOT_STARTED = 'NOT_STARTED',
	/** 进行中 */
	ONGOING = 'ONGOING',
	/** 已结束，手动结束 */
	ENDED = 'ENDED',
	/** 已结束，已用完 */
	FINISHED = 'FINISHED',
	/** 已结束，已过期 */
	EXPIRED = 'EXPIRED',
}

export enum CouponScope {
	ALL = 'ALL',
	PRODUCT = 'PRODUCT',
	CATEGORY = 'CATEGORY',
}

@Entity()
export class Coupon {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column({ default: CouponType.DISCOUNT_AMOUNT })
	type: string;

	// 优惠券面值
	@Column()
	value: number;

	// 门槛
	@Column()
	threshold: number;

	@Column()
	startDate: Date;

	@Column()
	endDate: Date;

	//
	@Column()
	quantity: number;

	//
	@Column()
	quantityPerUser: number;

	@Column()
	status: string;

	// 使用范围
	@Column()
	scope: string;

	@OneToMany(() => CouponItem, (couponItem) => couponItem.coupon)
	couponItems: CouponItem[];

	// 关联的商品，scope为PRODUCT时有效
	@ManyToMany(() => Product, (product) => product.coupons)
	@JoinTable({
		name: 'coupon_product',
		joinColumn: { name: 'coupon_id' },
		inverseJoinColumn: { name: 'product_id' },
	})
	products: Product[];

	// 关联的分类，scope为CATEGORY时有效
	@ManyToMany(() => ProductCategory, (ProductCategory) => ProductCategory.coupons)
	@JoinTable({
		name: 'coupon_category',
		joinColumn: { name: 'coupon_id' },
		inverseJoinColumn: { name: 'category_id' },
	})
	categories: ProductCategory[];

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'last_modified_at' })
	lastModifiedAt: Date;

	@DeleteDateColumn({ name: 'deleted_at' })
	deletedAt: Date;

	@ManyToMany(() => OrderItem, (orderItem) => orderItem.coupon)
	@JoinTable({
		name: 'coupon_order_item',
		joinColumn: { name: 'coupon_id' },
		inverseJoinColumn: { name: 'order_item_id' },
	})
	orderItem: OrderItem;

	@ManyToMany(() => Order, (order) => order.generalCoupon)
	@JoinTable({
		name: 'coupon_order',
		joinColumn: { name: 'coupon_id' },
		inverseJoinColumn: { name: 'order_id' },
	})
	orders: Order[];
}
