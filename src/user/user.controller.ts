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
	UseFilters,
} from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';
import { getUserDto } from './dto/get-users.dto';
import { TypeormFilter } from '../filters/typeorm.filter';

@Controller('user')
@UseFilters(new TypeormFilter())
export class UserController {
	constructor(private userService: UserService) {}

	@Get()
	getUsers(@Query() query: getUserDto): any {
		console.log('~log message:~line29', query);
		return this.userService.findAll(query);
	}

	@Get()
	getByUsername(@Query() query): any {
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
