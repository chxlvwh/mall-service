import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSeckillDto {
	@IsNotEmpty()
	name: string;

	@IsNotEmpty()
	startDate: Date;

	@IsNotEmpty()
	endDate: Date;

	@IsOptional()
	switch?: number;
}
