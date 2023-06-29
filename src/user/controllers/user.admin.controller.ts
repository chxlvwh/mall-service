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
	Req,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { User } from '../entity/user.entity';
import { UserService } from '../user.service';
import { GetUserDto } from '../dto/get-users.dto';
import { CreateUserPipe } from '../pipes/create-user.pipe';
import { CreateUserDto } from '../dto/create-user.dto';
import { AdminGuard } from '../../guards/admin.guard';
import { JwtGuard } from '../../guards/jwt.guard';
import { UpdateUserDto } from '../dto/update-user.dto';
import { TypeORMFilter } from '../../decorators/TypeORMFilter';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('Admin User')
@Controller('admin/user')
@TypeORMFilter()
// 这里等同于 @UseGuards(AuthGuard('jwt')), JwtGuard 只不过做了一层封装
// controller 中 guard 的优先级大于方法中的。
@UseGuards(JwtGuard, AdminGuard)
// @UseInterceptors(SerializeInterceptor)
export class UserAdminController {
	constructor(private userService: UserService) {}

	@ApiProperty({ type: GetUserDto })
	@Get('list')
	getAllUsers(@Query() query: GetUserDto, @Req() request): any {
		return this.userService.findAll(request.query);
	}

	@Get('info')
	getSelfInfo(@Req() request): Promise<User> {
		return this.userService.findOne(request.user.userId);
	}

	@Get(':id')
	getUserById(@Param('id') id: number): Promise<User> {
		return this.userService.findOne(id);
	}

	@Post()
	createUser(@Body(CreateUserPipe) createUserDto: CreateUserDto): Promise<User> {
		return this.userService.create(createUserDto);
	}

	@ApiProperty({ name: 'id' })
	@Put(':id/restore')
	@HttpCode(204)
	async restoreUser(@Param('id', ParseIntPipe) id: number): Promise<any> {
		return await this.userService.restore(id);
	}

	@Put(':id')
	updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto): any {
		// 权限1：判断用户是否是自己
		// 权限2：判断用户是否有更新user的权限
		// 返回数据：不能包含敏感的password等信息
		return this.userService.update(id, updateUserDto);
	}

	@Delete(':id')
	@HttpCode(204)
	deleteUser(@Param('id', ParseIntPipe) id: number): any {
		return this.userService.remove(id);
	}

	@Get(':id/profile')
	async getUserProfile(
		@Param('id', ParseIntPipe) id: number,
		// 这里的req中的user是通过AuthGuard('jwt')中的validate方法返回的
		// PassportModule来添加的
		// @Req() req,
	): Promise<User> {
		return await this.userService.findProfile(id);
	}
}
