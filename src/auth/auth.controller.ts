import {
	BadRequestException,
	Body,
	Controller,
	Post,
	UseFilters,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeormFilter } from '../filters/typeorm.filter';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
@UseFilters(new TypeormFilter())
export class AuthController {
	constructor(private authService: AuthService) {}
	@Post('login')
	login(@Body() loginUserDto: LoginUserDto) {
		return this.authService.login(loginUserDto);
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
