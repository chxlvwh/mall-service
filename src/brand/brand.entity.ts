import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Product } from '../product/entity/product.entity';

@Entity()
export class Brand {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column({ nullable: true })
	desc: string;

	@OneToMany(() => Product, (product) => product.brand)
	products: Product[];

	@CreateDateColumn({ name: 'created_at' })
	createdAt: string;

	@UpdateDateColumn({ name: 'last_modified_at' })
	lastModifiedAt: string;
}
