// 生成一个产品分类的实体类
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
	CreateDateColumn,
	UpdateDateColumn,
	JoinColumn,
	Tree,
	TreeChildren,
	TreeParent,
	DeleteDateColumn,
	ManyToMany,
	JoinTable,
} from 'typeorm';
import { Product } from '../product/product.entity';
import { ProductAttribute } from '../product-attribute/product-attribute.entity';

@Entity()
@Tree('closure-table')
export class ProductCategory {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column({ nullable: true })
	desc: string;

	@Column({ nullable: true })
	icon: string;

	@Column({ nullable: true })
	order: number;

	@Column({ name: 'is_active', default: true })
	isActive: boolean;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'last_modified_at' })
	lastModifiedAt: Date;

	@ManyToMany(() => Product, (product) => product.productCategory)
	products: Product[];

	// @OneToMany(() => ProductAttribute, (attribute) => attribute.productCategory)
	// productAttribute: ProductAttribute[];

	// @ManyToOne(() => ProductCategory, (ProductCategory) => ProductCategory.children)
	@JoinColumn({ name: 'parent_id' })
	@TreeParent({ onDelete: 'SET NULL' })
	parent: ProductCategory;

	// @OneToMany(() => ProductCategory, (ProductCategory) => ProductCategory.parent)
	@TreeChildren({ cascade: true })
	children: ProductCategory[];

	@DeleteDateColumn({ name: 'deleted_at' })
	deletedAt: Date;

	@ManyToMany(() => ProductAttribute, (productCategory) => productCategory.productCategory)
	@JoinTable({
		name: 'categories_attributes',
		joinColumn: { name: 'product_category_id' },
		inverseJoinColumn: { name: 'product_attribute_id' },
	})
	productAttributes: ProductAttribute[];
}
