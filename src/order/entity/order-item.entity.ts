import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../product/entity/product.entity';
import { Sku } from '../../product/entity/sku.entity';
import { CouponItem } from '../../coupon/entity/coupon-item.entity';

export enum OrderItemStatus {
	/** 未发货 */
	NOT_DELIVERED = 'NOT_DELIVERED',
	/** 已发货 */
	DELIVERED = 'DELIVERED',
	/** 已收货 */
	RECEIVED = 'RECEIVED',
}

@Entity()
export class OrderItem {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	quantity: number;

	// 0: 未发货 1: 已发货 2: 已收货
	@Column()
	status: string;

	@Column({ name: 'total_price' })
	totalPrice: number;

	@Column({ name: 'discounted_total_price' })
	discountedTotalPrice: number;

	@Column({ name: 'base_price' })
	basePrice: number;

	@ManyToOne(() => Order, (order) => order.items)
	@JoinColumn({ name: 'order_no' })
	order: Order;

	@ManyToOne(() => Product, (product) => product.orderItem)
	@JoinColumn({ name: 'product_id' })
	product: Product;

	@ManyToOne(() => Sku, (sku) => sku.orderItem)
	@JoinColumn({ name: 'sku_id' })
	sku: Sku;

	@OneToOne(() => CouponItem, (couponItem) => couponItem.orderItem)
	@JoinColumn({ name: 'coupon_item_id' })
	couponItem: CouponItem;
}
