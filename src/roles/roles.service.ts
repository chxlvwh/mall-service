import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Roles } from './roles.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RolesService {
	constructor(
		@InjectRepository(Roles)
		private readonly rolesRepository: Repository<Roles>,
	) {}

	find(dto: any) {
		return this.rolesRepository.find(dto);
	}

	findOne(id: number) {
		return this.rolesRepository.findOne({
			where: {
				id,
			},
		});
	}
}
