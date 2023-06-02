import { Roles } from '../../roles/roles.entity';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	username: string;

	@IsString()
	@IsNotEmpty()
	@Length(6, 32)
	password: string;

	@IsOptional()
	remark?: string;

	@IsOptional()
	gender?: number;

	@IsOptional()
	address?: string;

	@IsOptional()
	avatar?: string;

	@IsOptional()
	email?: string;

	@IsOptional()
	nickname?: string;

	@IsOptional()
	isDeleted?: number;

	@IsOptional()
	roles?: Roles[] | number[];
}
