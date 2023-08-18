import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Product } from '../product/entity/product.entity';
import { RecommendBrand } from '../recommend-brand/recommend-brand.entity';

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
	createdAt: Date;

	@UpdateDateColumn({ name: 'last_modified_at' })
	lastModifiedAt: Date;

	@DeleteDateColumn({ name: 'deleted_at' })
	deletedAt: Date;

	@OneToOne(() => RecommendBrand, (recommendBrand) => recommendBrand.brand)
	recommendBrand: RecommendBrand;
}
