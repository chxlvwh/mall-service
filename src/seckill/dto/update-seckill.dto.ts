import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateSeckillDto {
	@IsNotEmpty()
	title: string;

	@IsNotEmpty()
	startDate: Date;

	@IsNotEmpty()
	endDate: Date;

	@IsOptional()
	isOnline?: number;
}
