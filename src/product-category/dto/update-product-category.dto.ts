import { Allow, IsNotEmpty } from 'class-validator';

export class UpdateProductCategoryDto {
	@IsNotEmpty()
	name: string;

	@Allow()
	desc: string;

	@Allow()
	parentId: number;

	@Allow()
	icon: string;

	@IsNotEmpty()
	order: number;

	@Allow()
	isActive: boolean;
}
