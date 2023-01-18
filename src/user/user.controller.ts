import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
} from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	@Get()
	listUser(): any {
		return this.userService.findAll();
	}

	@Get()
	get(@Query() query): any {
		return this.userService.find(query.username);
	}

	@Post()
	createUser(@Body() user: User): any {
		const newUser = {
			username: user.username,
			password: user.password,
		} as User;
		return this.userService.create(newUser);
	}

	@Put(':id')
	updateUser(@Param() params, @Body() user: User): any {
		const newUser = {
			username: user.username,
			password: user.password,
		} as User;
		return this.userService.update(params.id, newUser);
	}

	@Delete('/:id')
	@HttpCode(204)
	deleteUser(@Param() params): any {
		this.userService.remove(params.id);
	}

	@Get('/:id/profile')
	getUserProfile(@Param() params): any {
		console.log('~log message:~line58', params);
		return this.userService.findProfile(Number(params.id));
	}
}
