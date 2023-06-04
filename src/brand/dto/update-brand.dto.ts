import { Allow, IsOptional } from 'class-validator';

export class UpdateBrandDto {
	@Allow()
	name: string;

	@IsOptional()
	desc: string;
}
