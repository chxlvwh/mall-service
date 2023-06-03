import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateBrandDto {
	@IsNotEmpty()
	id: number;

	@IsNotEmpty()
	name: string;

	@IsOptional()
	desc: string;
}
