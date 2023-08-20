import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePeriodDto {
	@IsNotEmpty()
	name: string;

	@IsNotEmpty()
	startTime: Date;

	@IsNotEmpty()
	endTime: Date;

	@IsOptional()
	enable: boolean;
}
