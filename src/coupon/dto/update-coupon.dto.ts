import { IsOptional } from 'class-validator';

export class UpdateCouponDto {
	@IsOptional()
	startDate: Date;

	@IsOptional()
	endDate: Date;
}
