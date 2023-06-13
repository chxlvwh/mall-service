import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductCategory } from '../product-category/product-category.entity';
import { DateProps } from '../utils/common';

export enum EntryMethodEnum {
	INPUT = 1,
	SELECT,
}
export enum TypeEnum {
	INPUT = 1,
	SELECT,
}
@Entity()
export class ProductAttribute extends DateProps {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column({ type: 'enum', enum: EntryMethodEnum, name: 'entry_method' })
	entryMethod: EntryMethodEnum;

	// 传null的时候默认值生效，只有传true是true，其他都为false
	@Column({ name: 'is_required', nullable: true, default: 0 })
	isRequired: number;

	@Column({ name: 'can_search', nullable: true, default: 0 })
	canSearch: number;

	@Column()
	type: TypeEnum;

	@Column({ nullable: true })
	desc: string;

	@Column({ nullable: true })
	value: string;

	@ManyToMany(() => ProductCategory, (productCategory) => productCategory.productAttributes)
	productCategory: ProductCategory[];
}
