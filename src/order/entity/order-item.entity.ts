import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../product/entity/product.entity';

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

	@ManyToMany(() => Order, (order) => order.items)
	order: Order;

	@ManyToMany(() => Product, (product) => product.orderItem)
	@JoinTable({
		name: 'order_item_product',
		joinColumn: { name: 'product_id' },
		inverseJoinColumn: { name: 'order_item_id' },
	})
	product: Product;
}
