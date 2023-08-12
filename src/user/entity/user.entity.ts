import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Logs } from '../../logs/logs.entity';
import { Roles } from '../../roles/roles.entity';
import { Profile } from './profile.entity';
import { Exclude } from 'class-transformer';
import { Order } from '../../order/entity/order.entity';
import { Receiver } from './receiver.entity';
import { CouponItem } from '../../coupon/entity/coupon-item.entity';
import { Comment } from '../../comment/comment.entity';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	username: string;

	@Column({ unique: true })
	@Exclude()
	password: string;

	@OneToMany(() => Logs, (logs) => logs.user)
	logs: Logs[];

	@ManyToMany(() => Roles, (roles) => roles.users)
	@JoinTable({ name: 'users_roles' })
	roles: Roles[];

	@OneToMany(() => Comment, (comment) => comment.user)
	comments: Comment[];

	@OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
	profile: Profile;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'last_modified' })
	lastModifiedAt: Date;

	@DeleteDateColumn({ name: 'delete_at' })
	deletedAt: Date;

	@OneToMany(() => Order, (order) => order.user)
	orders: Order[];

	@OneToMany(() => Receiver, (receiver) => receiver.user)
	receivers: Receiver[];

	@OneToMany(() => CouponItem, (couponItem) => couponItem.user)
	couponItems: CouponItem[];
}
