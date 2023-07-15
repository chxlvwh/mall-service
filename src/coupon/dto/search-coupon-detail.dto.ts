import { IsOptional } from 'class-validator';

export class SearchCouponDetailDto {
	@IsOptional()
	withCouponItems: boolean;
}
