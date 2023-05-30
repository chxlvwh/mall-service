import { Allow } from 'class-validator';
import { Profile } from '../profile.entity';

export class UpdateUserDto {
	@Allow()
	profile?: Profile;
}
