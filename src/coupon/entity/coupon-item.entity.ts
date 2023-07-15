import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Coupon } from './coupon.entity';

/**
 * 已领取优惠券
 */
@Entity()
export class CouponItem {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	code: string;

	@Column({ name: 'used_date', nullable: true })
	usedDate: Date;

	// 领取时间
	@Column({ name: 'received_date', nullable: true })
	receivedDate: Date;

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
}
