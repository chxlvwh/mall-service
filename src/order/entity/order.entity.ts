import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
	PrimaryColumn,
	UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { User } from '../../user/entity/user.entity';
import { Receiver } from '../../user/entity/receiver.entity';
import { Coupon } from '../../coupon/entity/coupon.entity';

export enum PaymentMethod {
	'WECHAT' = 'WECHAT',
	'ALIPAY' = 'ALIPAY',
}

export enum OrderSource {}

export enum OrderStatus {
	'UNPAID' = 'UNPAID',
	'PAYMENT_PENDING' = 'PAYMENT_PENDING',
	'PAID' = 'PAID',
	'SELLER_DELIVERED' = 'SELLER_DELIVERED',
	'TRANSACTION_SUCCESSFUL' = 'TRANSACTION_SUCCESSFUL',
	'TRANSACTION_CLOSED' = 'TRANSACTION_CLOSED',
	'REFUNDING' = 'REFUNDING',
}

@Entity()
export class Order {
	@PrimaryColumn()
	id: string;

	// 支付方式 1: 微信支付 2: 支付宝支付
	@Column({ nullable: true })
	payment_method: string;

	// 订单来源
	@Column({ nullable: true })
	orderSource: string;

	// 支付状态 1: 未支付 2: 付款确认中 3: 已付款 4: 卖家已发货 5: 交易成功 6: 交易关闭 7: 退款中
	@Column()
	status: string;

	@Column({ nullable: true })
	remark: string;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@Column({ name: 'payment_time', nullable: true })
	paymentTime: Date;

	// @Column()
	// transactTime: Date;

	@UpdateDateColumn({ name: 'last_modified_at' })
	lastModifiedAt: Date;

	@DeleteDateColumn({ name: 'deleted_at' })
	deletedAt: Date;

	@ManyToMany(() => OrderItem, (orderItem) => orderItem.order)
	@JoinTable({
		name: 'order_item_order',
		joinColumn: { name: 'order_item_id' },
		inverseJoinColumn: { name: 'order_id' },
	})
	items: OrderItem[];

	@ManyToMany(() => User, (user) => user.orders)
	user: User;

	@ManyToMany(() => Receiver, (receiver) => receiver.orders, { eager: true })
	@JoinTable({
		name: 'order_receiver',
		joinColumn: { name: 'order_id' },
		inverseJoinColumn: { name: 'receiver_id' },
	})
	receiver: Receiver;

	@ManyToMany(() => Coupon, (coupon) => coupon.orders, { eager: true })
	generalCoupon: Coupon;
}
