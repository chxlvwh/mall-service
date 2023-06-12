import { Column, Entity, JoinColumn, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductCategory } from '../product-category/product-category.entity';

export type EntryMethodEnum = 1 | 2;
export type TypeEnum = 1 | 2;
@Entity()
export class ProductAttribute {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column({ type: 'enum', enum: [1, 2], name: 'entry_method' })
	entryMethod: EntryMethodEnum;

	// 传null的时候默认值生效，只有传true是true，其他都为false
	@Column({ name: 'is_required', nullable: true, default: false })
	isRequired: boolean;

	@Column({ name: 'can_search', nullable: true, default: true })
	canSearch: boolean;

	@Column({ type: 'enum', enum: [1, 2] })
	type: TypeEnum;

	@ManyToMany(() => ProductCategory, (productCategory) => productCategory.productAttributes)
	productCategory: ProductCategory[];

	// @ManyToOne(() => ProductCategory, (productCategory) => productCategory.productAttribute)
	// @JoinColumn({ name: 'product_category_id' })
	// productCategory: ProductCategory;

	// @ManyToOne(() => AttributeCategory, (attributeCategory) => attributeCategory.productAttribute)
	// @JoinColumn({ name: 'attribute_category_id' })
	// attributeCategory: AttributeCategory;
}
