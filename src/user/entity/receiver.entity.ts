import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Order } from '../../order/entity/order.entity';

@Entity()
export class Receiver {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	phone: string;

	@Column()
	address: string;

	@Column()
	houseNo: string;

	@Column()
	addressName: string;

	@Column({ nullable: true })
	province: string;

	@Column({ nullable: true })
	city: string;

	@Column({ nullable: true })
	region: string;

	@Column({ nullable: true })
	zip: string;

	@Column({ name: 'is_default', default: false })
	isDefault: boolean;

	@ManyToOne(() => User, (user) => user.receivers)
	@JoinColumn({ name: 'user_id' })
	user: User;

	@OneToMany(() => Order, (order) => order.receiver)
	orders: Order[];
}
