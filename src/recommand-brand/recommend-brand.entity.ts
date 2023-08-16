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
import { Brand } from '../brand/brand.entity';

@Entity()
export class RecommendBrand {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: true, name: 'is_recommend' })
	isRecommend: boolean;

	@Column({ nullable: true, name: 'sort' })
	sort: number;

	@OneToOne(() => Brand, (brand) => brand.recommendBrand)
	@JoinColumn({ name: 'brand_id' })
	brand: Brand;

	@CreateDateColumn({ nullable: true, name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ nullable: true, name: 'last_modified_at' })
	lastModifiedAt: Date;

	@DeleteDateColumn({ nullable: true, name: 'deleted_at' })
	deletedAt: Date;
}
