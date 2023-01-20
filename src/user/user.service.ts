import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { getUserDto } from './dto/get-users.dto';
import { conditionUtils } from '../utils/db.helper';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	findAll(query: getUserDto) {
		const { limit, page, username, gender, role } = query;
		const take = limit || 10;
		const skip = ((page || 1) - 1) * take;
		const queryBuilder = this.userRepository
			.createQueryBuilder('user')
			.leftJoinAndSelect('user.profile', 'profile')
			.leftJoinAndSelect('user.roles', 'roles');

		const obj = {
			'user.username': username,
			'profile.gender': gender,
			'roles.id': role,
		};

		return conditionUtils(queryBuilder, obj)
			.take(take)
			.skip(skip)
			.getMany();
		/**
		 * return this.userRepository.find({
		 * 			select: {
		 * 				id: true,
		 * 				username: true,
		 * 				profile: {
		 * 					gender: true,
		 * 				},
		 * 			},
		 * 			relations: {
		 * 				profile: true,
		 * 				roles: true,
		 * 			},
		 * 			where: {
		 * 				username,
		 * 				profile: {
		 * 					gender: gender,
		 * 				},
		 * 				roles: {
		 * 					id: role,
		 * 				},
		 * 			},
		 * 			take,
		 * 			skip,
		 * 		});
		 */
	}

	find(username: string) {
		return this.userRepository.findOne({ where: { username } });
	}

	async create(user: User) {
		const userTmp = await this.userRepository.create(user);
		return await this.userRepository.save(userTmp);
	}

	async update(id: number, user: Partial<User>) {
		return this.userRepository.update(id, user);
	}

	remove(id: number) {
		return this.userRepository.delete(id);
	}

	findProfile(id: number) {
		return this.userRepository.findOne({
			where: { id },
			relations: { profile: true },
		});
	}
}
