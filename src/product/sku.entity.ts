import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Sku {
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty()
	@Column()
	price: number;

	@ApiProperty()
	@Column()
	stock: number;

	@ApiProperty()
	@Column({ type: 'json', nullable: true })
	props: JSON;

	@ManyToOne(() => Product, (product) => product.skus)
	@JoinColumn({ name: 'product_id' })
	product: Product;
}
