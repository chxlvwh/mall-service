import { IsOptional, IsString } from 'class-validator';
import { Profile } from '../profile.entity';

export class UpdateUserDto {
	@IsString()
	username: string;

	@IsOptional()
	profile?: Profile;
}
