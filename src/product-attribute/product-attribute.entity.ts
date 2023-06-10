import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductCategory } from '../product-category/product-category.entity';

export type EntryMethodEnum = 1 | 2;
export type TypeEnum = 1 | 2;
@Entity()
export class ProductAttribute {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column({ type: 'enum', enum: [1, 2], name: 'entry_method', default: 1 })
	entryMethod: EntryMethodEnum;

	@Column({ name: 'is_required', nullable: true })
	isRequired: boolean;

	@Column({ name: 'can_search' })
	canSearch: boolean;

	@Column({ type: 'enum', enum: [1, 2] })
	type: TypeEnum;

	@ManyToOne(() => ProductCategory, (productCategory) => productCategory.productAttribute)
	@JoinColumn({ name: 'product_category_id' })
	productCategory: ProductCategory;
}
