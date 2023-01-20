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
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
@UseFilters(new TypeormFilter())
export class UserController {
	constructor(private userService: UserService) {}

	@Get()
	getAllUsers(@Query() query: getUserDto): any {
		return this.userService.findAll(query);
	}

	@Get(':id')
	getUserById(@Param('id') id: number): Promise<User> {
		return this.userService.findOne(id);
	}

	@Post()
	createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
		return this.userService.create(createUserDto);
	}

	@Put(':id')
	updateUser(@Param() params, @Body() user: User): any {
		const newUser = {
			username: user.username,
			password: user.password,
		} as User;
		return this.userService.update(params.id, newUser);
	}

	@Delete(':id')
	@HttpCode(204)
	deleteUser(@Param() params): any {
		this.userService.remove(params.id);
	}

	@Get(':id/profile')
	async getUserProfile(@Param() params): Promise<User> {
		const res = await this.userService.findProfile(Number(params.id));
		if (res) {
			Reflect.deleteProperty(res, 'password');
		}
		return res;
	}
}
