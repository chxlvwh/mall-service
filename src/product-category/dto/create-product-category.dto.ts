// 生成一个创建product-category的dto

// Path: src\product-category\dto\create-category.dto.ts
// Compare this snippet from src\brand\brand.controller.ts:
import { Allow, IsNotEmpty } from 'class-validator';

export default class CreateProductCategoryDto {
	@IsNotEmpty()
	name: string;

	@Allow()
	desc: string;

	@Allow()
	picture: string;

	@Allow()
	parentId: number;

	@Allow()
	icon: string;

	@Allow()
	order: number;

	@Allow()
	isActive: boolean;
}
