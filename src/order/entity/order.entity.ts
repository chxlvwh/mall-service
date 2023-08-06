import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryColumn,
	UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { User } from '../../user/entity/user.entity';
import { Receiver } from '../../user/entity/receiver.entity';
import { CouponItem } from '../../coupon/entity/coupon-item.entity';

export enum PaymentMethod {
	'WECHAT' = 'WECHAT',
	'ALIPAY' = 'ALIPAY',
}

export enum OrderSource {}

export enum OrderStatus {
	/** 待付款 */
	'UNPAID' = 'UNPAID',
	/** 待发货 */
	'DELIVERING' = 'DELIVERING',
	/** 待收货 */
	'DELIVERED' = 'DELIVERED',
	/** 待评价 */
	'COMMENTING' = 'COMMENTING',
	/** 已完成 */
	'COMPLETED' = 'COMPLETED',
	/** 退款中 */
	'REFUNDING' = 'REFUNDING',
	/** 已退款 */
	'REFUNDED' = 'REFUNDED',
	/** 已关闭 */
	'CLOSED' = 'CLOSED',
}

@Entity()
export class Order {
	// @PrimaryGeneratedColumn()
	// id: number;

	// 订单号
	@PrimaryColumn({ name: 'order_no' })
	orderNo: string;

	// 支付方式 1: 微信支付 2: 支付宝支付
	@Column({ nullable: true, name: 'payment_method' })
	paymentMethod: string;

	// 订单来源
	@Column({ nullable: true, name: 'order_source' })
	orderSource: string;

	@Column()
	status: string;

	@Column({ nullable: true })
	remark: string;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@Column({ name: 'payment_time', nullable: true })
	paymentTime: Date;

	// 发货单流水号
	@Column({ name: 'delivery_no', nullable: true })
	deliveryNo: string;

	// 物流单号
	@Column({ name: 'logistics_no', nullable: true })
	logisticsNo: string;

	// 物流公司
	@Column({ name: 'logistics_company', nullable: true })
	logisticsCompany: string;

	@Column({ name: 'delivery_time', nullable: true })
	deliveryTime: Date;

	// 确认收货时间
	@Column({ name: 'receive_time', nullable: true })
	receiveTime: Date;

	// 自动确认收货时间
	@Column({ name: 'auto_receive_time', nullable: true })
	autoReceiveTime: Date;

	// 评价时间
	@Column({ name: 'comment_time', nullable: true })
	commentTime: Date;

	@UpdateDateColumn({ name: 'last_modified_at' })
	lastModifiedAt: Date;

	@DeleteDateColumn({ name: 'deleted_at' })
	deletedAt: Date;

	// 总价格
	@Column({ name: 'total_price' })
	totalPrice: number;

	@OneToMany(() => OrderItem, (orderItem) => orderItem.order, { eager: true })
	items: OrderItem[];

	@ManyToOne(() => User, (user) => user.orders)
	@JoinColumn({ name: 'user_id' })
	user: User;

	@ManyToOne(() => Receiver, (receiver) => receiver.orders)
	@JoinColumn({ name: 'receiver_id' })
	receiver: Receiver;

	@OneToOne(() => CouponItem, (couponItem) => couponItem.order)
	@JoinColumn({ name: 'general_coupon_item_id' })
	generalCouponItem: CouponItem;
}
