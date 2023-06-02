import { Allow, IsOptional } from 'class-validator';
import { Profile } from '../profile.entity';
import { Roles } from '../../roles/roles.entity';

export class UpdateUserDto {
	@Allow()
	username: string;

	@Allow()
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
