import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { TypeORMFilter } from '../decorators/TypeORMFilter';

@Controller('auth')
@TypeORMFilter()
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
		return this.authService.signup(loginUserDto);
	}
}
