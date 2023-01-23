import {
	BadRequestException,
	Body,
	ClassSerializerInterceptor,
	Controller,
	Post,
	UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { TypeORMFilter } from '../decorators/TypeORMFilter';

@Controller('auth')
@TypeORMFilter()
@UseInterceptors(ClassSerializerInterceptor)
// @UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
	constructor(private authService: AuthService) {}
	@Post('login')
	async login(@Body() loginUserDto: LoginUserDto) {
		const token = await this.authService.login(loginUserDto);
		return {
			access_token: token,
		};
	}

	@Post('signup')
	signup(@Body() loginUserDto: LoginUserDto) {
		const { username, password } = loginUserDto;
		if (!username || !password) {
			throw new BadRequestException('用户名或密码不能为空');
		}
		return this.authService.signup(loginUserDto);
	}
}
