import { IsOptional } from 'class-validator';

export class UpdateRecommendPopularDto {
	@IsOptional()
	isRecommend: number;

	@IsOptional()
	sort: number;
}
