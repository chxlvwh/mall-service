import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
	@IsString()
	@IsNotEmpty()
	username: string;

	@IsString()
	@IsNotEmpty()
	// @Length(6, 32)
	password: string;
}
