import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { getUserDto } from '../user/dto/get-users.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
	constructor(private userService: UserService) {}
	login(loginUserDto: LoginUserDto) {
		const { username } = loginUserDto;
		return this.userService.findAll({ username } as getUserDto);
	}

	signup(loginUserDto: LoginUserDto) {
		return this.userService.create(loginUserDto);
	}
}
