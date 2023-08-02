import {
	Column,
	DeleteDateColumn,
	Entity,
	JoinColumn,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { ApiProperty } from '@nestjs/swagger';
import { OrderItem } from '../../order/entity/order-item.entity';

@Entity()
export class Sku {
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty()
	@Column()
	price: number;

	@ApiProperty()
	@Column({ nullable: true })
	code: string;

	@ApiProperty()
	@Column()
	stock: number;

	@ApiProperty({ description: 'name:属性名，value:属性值' })
	@Column({ type: 'json', nullable: true })
	props: JSON;

	@ManyToOne(() => Product, (product) => product.skus)
	@JoinColumn({ name: 'product_id' })
	product: Product;

	@OneToMany(() => OrderItem, (orderItem) => orderItem.sku)
	orderItem: OrderItem;

	@DeleteDateColumn({ name: 'deleted_at' })
	deletedAt: Date;
}
