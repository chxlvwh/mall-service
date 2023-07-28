import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../product/entity/product.entity';
import { Coupon } from '../../coupon/entity/coupon.entity';
import { Sku } from '../../product/entity/sku.entity';

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

	@Column()
	discountedPrice: number;

	// 0: 未发货 1: 已发货 2: 已收货
	@Column()
	status: string;

	@ManyToMany(() => Coupon, (coupon) => coupon.orderItem)
	coupon: Coupon;

	@ManyToMany(() => Order, (order) => order.items)
	order: Order;

	@ManyToMany(() => Product, (product) => product.orderItem)
	@JoinTable({
		name: 'order_item_product',
		joinColumn: { name: 'product_id' },
		inverseJoinColumn: { name: 'order_item_id' },
	})
	product: Product;

	@ManyToMany(() => Sku, (sku) => sku.orderItem)
	@JoinTable({
		name: 'order_item_sku',
		joinColumn: { name: 'sku_id' },
		inverseJoinColumn: { name: 'order_item_id' },
	})
	sku: Sku;
}
