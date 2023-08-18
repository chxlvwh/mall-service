import { IsOptional } from 'class-validator';

export class UpdateRecommendNewDto {
	@IsOptional()
	isRecommend: number;

	@IsOptional()
	sort: number;
}
