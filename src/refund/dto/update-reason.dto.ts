import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class UpdateReasonDto {
	@IsOptional()
	value?: string;

	@IsOptional()
	isActive?: boolean;

	@IsOptional()
	sort?: number;
}
