import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSeckillDto {
	@IsNotEmpty()
	title: string;

	@IsNotEmpty()
	startDate: Date;

	@IsNotEmpty()
	endDate: Date;

	@IsOptional()
	isOnline?: number;
}
