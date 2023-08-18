import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Product } from '../product/entity/product.entity';

@Entity()
export class RecommendPopular {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: true, name: 'is_recommend' })
	isRecommend: boolean;

	@Column({ nullable: true, name: 'sort' })
	sort: number;

	@OneToOne(() => Product, (product) => product.recommendNew)
	@JoinColumn({ name: 'product_id' })
	product: Product;

	@CreateDateColumn({ nullable: true, name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ nullable: true, name: 'last_modified_at' })
	lastModifiedAt: Date;

	@DeleteDateColumn({ nullable: true, name: 'deleted_at' })
	deletedAt: Date;
}
