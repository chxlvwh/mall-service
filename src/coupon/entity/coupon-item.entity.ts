import {
	Column,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Coupon } from './coupon.entity';
import { Order } from '../../order/entity/order.entity';
import { OrderItem } from '../../order/entity/order-item.entity';

/**
 * 已领取优惠券
 */
@Entity()
export class CouponItem {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	code: string;

	// 使用时间
	@Column({ name: 'used_date', nullable: true })
	usedDate: Date;

	// 领取时间
	@Column({ name: 'received_date', nullable: true })
	receivedDate: Date;

	// 是否已使用
	@Column({ name: 'is_used', default: false })
	isUsed: boolean;

	@ManyToMany(() => User, (user) => user.couponItems)
	@JoinTable({
		name: 'user_coupon_item',
		joinColumn: { name: 'coupon_item_id' },
		inverseJoinColumn: { name: 'user_id' },
	})
	user: User;

	@ManyToOne(() => Coupon, (coupon) => coupon.couponItems)
	@JoinColumn({ name: 'coupon_id' })
	coupon: Coupon;

	@OneToOne(() => Order, (order) => order.generalCouponItem)
	order: Order;

	@OneToOne(() => OrderItem, (orderItem) => orderItem.couponItem)
	orderItem: OrderItem;
}
