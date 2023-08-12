import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../product/entity/product.entity';
import { Order } from '../order/entity/order.entity';
import { User } from '../user/entity/user.entity';

@Entity()
export class Comment {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Order, (order) => order.comments)
	order: Order;

	@ManyToOne(() => Product, (product) => product.comments)
	product: Product;

	@ManyToOne(() => User, (user) => user.comments)
	user: User;

	@Column()
	content: string;

	@Column({ nullable: true, name: 'created_at' })
	createdAt: Date;

	@Column({ nullable: true, name: 'last_modified_at' })
	lastModifiedAt: Date;

	@Column({ nullable: true, name: 'deleted_at' })
	deletedAt: Date;
}
