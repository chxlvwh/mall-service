import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { User } from '../../user/entity/user.entity';
import { Receiver } from '../../user/entity/receiver.entity';

@Entity()
export class Order {
	@PrimaryGeneratedColumn()
	id: number;

	// 支付方式 1: 微信支付 2: 支付宝支付
	@Column()
	payment_method: string;

	@Column()
	orderSource: string;

	// 支付状态 1: 未支付 2: 付款确认中 3: 已付款 4: 卖家已发货 5: 交易成功 6: 交易关闭 7: 退款中
	@Column()
	status: string;

	@Column()
	remark: string;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@Column()
	paymentTime: Date;

	@Column()
	transactTime: Date;

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

	@ManyToMany(() => User, (user) => user.orders, { eager: true })
	user: User;

	@ManyToMany(() => Receiver, (receiver) => receiver.orders, { eager: true })
	@JoinTable({
		name: 'order_receiver',
		joinColumn: { name: 'order_id' },
		inverseJoinColumn: { name: 'receiver_id' },
	})
	receiver: Receiver;
}
