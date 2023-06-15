import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToMany,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Product } from '../product/product.entity';

@Entity()
export class Brand {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column({ nullable: true })
	desc: string;

	@ManyToMany(() => Product, (product) => product.brand)
	products: any[];

	@CreateDateColumn({ name: 'created_at' })
	createdAt: string;

	@UpdateDateColumn({ name: 'last_modified_at' })
	lastModifiedAt: string;
}
