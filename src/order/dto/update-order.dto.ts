import { IsOptional } from 'class-validator';

export class UpdateOrderDto {
	@IsOptional()
	remark?: string;

	@IsOptional()
	status?: string;

	@IsOptional()
	deliveryTime?: Date;

	@IsOptional()
	receiveTime?: Date;

	@IsOptional()
	commentTime?: Date;

	@IsOptional()
	paymentTime?: Date;

	@IsOptional()
	paymentMethod?: string;

	@IsOptional()
	orderSource?: string;
}
