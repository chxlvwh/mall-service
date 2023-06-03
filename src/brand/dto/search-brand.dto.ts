import { Allow, IsOptional } from 'class-validator';

export class SearchBrandDto {
	@IsOptional()
	name: string;

	@Allow()
	current: number;

	@IsOptional()
	pageSize?: number;
}
