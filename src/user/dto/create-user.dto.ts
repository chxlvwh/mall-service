import { Roles } from '../../roles/roles.entity';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	username: string;

	@IsString()
	@IsNotEmpty()
	@Length(6, 32)
	password: string;

	roles?: Roles[] | number[];
}
