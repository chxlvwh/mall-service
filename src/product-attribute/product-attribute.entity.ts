import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
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
	@Column({ name: 'is_required', nullable: true, default: false })
	isRequired: boolean;

	@Column({ name: 'can_search', nullable: true, default: true })
	canSearch: boolean;

	@Column()
	type: TypeEnum;

	@ManyToMany(() => ProductCategory, (productCategory) => productCategory.productAttributes)
	productCategory: ProductCategory[];
}
