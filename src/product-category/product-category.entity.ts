// 生成一个产品分类的实体类
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	OneToMany,
	CreateDateColumn,
	UpdateDateColumn,
	JoinColumn,
	Tree,
	TreeChildren,
	TreeParent,
	DeleteDateColumn,
} from 'typeorm';
import { Product } from '../product/product.entity';

@Entity()
export class ProductCategory {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column({ nullable: true })
	desc: string;

	@Column({ nullable: true })
	icon: string;

	@Column()
	order: number;

	@Column({ name: 'is_active', default: true })
	isActive: boolean;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'last_modified_at' })
	lastModifiedAt: Date;

	@OneToMany(() => Product, (product) => product.productCategory)
	products: Product[];

	@ManyToOne(() => ProductCategory, (ProductCategory) => ProductCategory.children)
	@JoinColumn({ name: 'parent_id' })
	parent: ProductCategory;

	@OneToMany(() => ProductCategory, (ProductCategory) => ProductCategory.parent)
	children: ProductCategory[];

	@DeleteDateColumn({ name: 'deleted_at' })
	deletedAt: Date;
}
