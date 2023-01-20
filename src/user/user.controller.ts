import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	ParseIntPipe,
	Post,
	Put,
	Query,
	UseFilters,
} from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';
import { getUserDto } from './dto/get-users.dto';
import { TypeormFilter } from '../filters/typeorm.filter';
import { CreateUserPipe } from './pipes/create-user.pipe';
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
	createUser(@Body(CreateUserPipe) dto: CreateUserDto): Promise<User> {
		const user = dto as User;
		return this.userService.create(user);
	}

	@Put(':id')
	updateUser(@Param('id') id: number, @Body() dto: any): any {
		// 权限1：判断用户是否是自己
		// 权限2：判断用户是否有更新user的权限
		// 返回数据：不能包含敏感的password等信息
		return this.userService.update(id, dto);
	}

	@Delete(':id')
	@HttpCode(204)
	deleteUser(@Param() params): any {
		this.userService.remove(params.id);
	}

	@Get(':id/profile')
	async getUserProfile(@Param('id', ParseIntPipe) id: any): Promise<User> {
		const res = await this.userService.findProfile(id);
		if (res) {
			Reflect.deleteProperty(res, 'password');
		}
		return res;
	}
}
