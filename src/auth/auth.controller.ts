import {
	BadRequestException,
	Body,
	Controller,
	Post,
	UseFilters,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeormFilter } from '../filters/typeorm.filter';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Controller('auth')
@UseFilters(new TypeormFilter())
export class AuthController {
	constructor(private authService: AuthService) {}
	@Post('login')
	login(@Body() createUserDto: CreateUserDto) {
		return this.authService.login(createUserDto);
	}

	@Post('signup')
	signup(@Body() createUserDto: CreateUserDto) {
		const { username, password } = createUserDto;
		if (!username || !password) {
			throw new BadRequestException('用户名或密码不能为空');
		}
		return this.authService.signup(createUserDto);
	}
}
