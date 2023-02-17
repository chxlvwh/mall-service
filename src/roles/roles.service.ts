import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Roles } from './roles.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
	constructor(
		@InjectRepository(Roles)
		private readonly rolesRepository: Repository<Roles>,
	) {}

	async create(createRoleDto: CreateRoleDto) {
		const role = await this.rolesRepository.create(createRoleDto);
		return this.rolesRepository.save(role);
	}

	findAll() {
		return this.rolesRepository.find();
	}

	findOne(id: number) {
		return this.rolesRepository.findOne({
			where: {
				id,
			},
		});
	}

	async update(id: number, updateRoleDto: UpdateRoleDto) {
		const role = await this.findOne(id);
		const newRole = this.rolesRepository.merge(role, updateRoleDto);
		return this.rolesRepository.save(newRole);
	}

	remove(id: number) {
		// delete 可以根据id删除，remove参数是一个实例，而且remove会触发beforeRemove/afterRemove钩子
		return this.rolesRepository.delete(id);
	}
}
