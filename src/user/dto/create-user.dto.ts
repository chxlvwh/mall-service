import { Roles } from '../../roles/roles.entity';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { Profile } from '../profile.entity';

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	username: string;

	@IsString()
	@IsNotEmpty()
	@Length(6, 32)
	password: string;

	@IsOptional()
	roles?: Roles[] | number[];

	@IsOptional()
	profile?: Profile;
}
