import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Roles } from '../decorators/roles.decorator';
import { RolesEnum } from '../../enum/roles.enum';
import { RoleGuard } from '../guards/role.guard';
import { JwtGuard } from '../guards/jwt.guard';

@Controller('roles')
@Roles(RolesEnum.Admin)
// 执行顺序：从前往后
@UseGuards(JwtGuard, RoleGuard)
export class RolesController {
	constructor(private rolesService: RolesService) {}

	@Get()
	list() {
		return this.rolesService.findAll();
	}

	@Post()
	createRole(@Body() createRoleDto: CreateRoleDto) {
		return this.rolesService.create(createRoleDto);
	}

	@Get(':id')
	getByRoleId(@Param('id') id: string) {
		return this.rolesService.findOne(+id);
	}

	@Put(':id')
	updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
		return this.rolesService.update(+id, updateRoleDto);
	}

	@Delete(':id')
	removeRole(@Param('id') id: string) {
		return this.rolesService.remove(+id);
	}
}
