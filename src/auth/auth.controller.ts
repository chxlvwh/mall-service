import { Body, Controller, HttpStatus, Post, Res, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { TypeORMFilter } from '../decorators/TypeORMFilter';
import { Response } from 'express';

@Controller('auth')
@TypeORMFilter()
export class AuthController {
	constructor(private authService: AuthService) {}
	@Post('login')
	async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
		const token = await this.authService.login(loginUserDto);
		res.cookie('SESSIONID', token);
		res.setHeader('Access-Control-Expose-Headers', 'Set-Cookie');
		res.status(HttpStatus.CREATED).send({
			access_token: token,
		});
	}

	@Post('signup')
	signup(@Body() loginUserDto: LoginUserDto) {
		return this.authService.signup(loginUserDto);
	}
}
