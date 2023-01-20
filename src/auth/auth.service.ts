import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { getUserDto } from '../user/dto/get-users.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
	constructor(private userService: UserService) {}
	login(createUserDto: CreateUserDto) {
		const { username } = createUserDto;
		return this.userService.findAll({ username } as getUserDto);
	}

	signup(createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto);
	}
}
