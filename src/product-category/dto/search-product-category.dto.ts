import { Allow } from 'class-validator';

export class SearchProductCategoryDto {
	@Allow()
	current: number;

	@Allow()
	pageSize: number;

	@Allow()
	name: string;

	@Allow()
	isActive: boolean;

	@Allow()
	parentId: number;
}
