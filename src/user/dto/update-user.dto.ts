import { Allow } from 'class-validator';
import { Profile } from '../profile.entity';

export class UpdateUserDto {
	@Allow()
	username: string;

	@Allow()
	password: string;

	@Allow()
	profile: Profile;
}
