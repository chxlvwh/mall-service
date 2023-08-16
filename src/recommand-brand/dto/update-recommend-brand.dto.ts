import { IsOptional } from 'class-validator';

export class UpdateRecommendBrandDto {
	@IsOptional()
	isRecommend: number;

	@IsOptional()
	sort: number;
}
