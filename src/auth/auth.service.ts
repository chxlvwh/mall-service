import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/services/user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
	) {}
	async login(loginUserDto: LoginUserDto) {
		const { username, password } = loginUserDto;
		const user = await this.userService.find(username);
		if (!user) {
			throw new ForbiddenException('用户不存在，请注册');
		}
		const isPasswordValid = await argon2.verify(user.password, password);

		if (!isPasswordValid) {
			throw new ForbiddenException('用户名或密码错误');
		}

		// 生成token
		const token = await this.jwtService.signAsync({
			username: user.username,
			sub: user.id,
		});

		await this.cacheManager.set(`token-${user.id}`, token);

		return token;
	}

	async signup(loginUserDto: LoginUserDto) {
		const { username } = loginUserDto;
		const user = await this.userService.find(username);
		if (user) {
			throw new ForbiddenException('用户已存在');
		}
		return this.userService.create(loginUserDto);
	}

	async logout(user) {
		await this.cacheManager.del(`token-${user.id}`);
	}
}
