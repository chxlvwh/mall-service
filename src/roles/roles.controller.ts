import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
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
