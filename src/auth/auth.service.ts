import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService,
	) {}
	async login(loginUserDto: LoginUserDto) {
		const { username, password } = loginUserDto;
		const user = await this.userService.find(username);
		if (user && user.password === password) {
			// 生成token
			return await this.jwtService.signAsync({
				username: user.username,
				sub: user.id,
			});
		}
		return new UnauthorizedException();
	}

	signup(loginUserDto: LoginUserDto) {
		return this.userService.create(loginUserDto);
	}
}
