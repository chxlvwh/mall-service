import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { In, Repository } from 'typeorm';
import { GetUserDto } from './dto/get-users.dto';
import { conditionUtils } from '../utils/db.helper';
import { Roles } from '../roles/roles.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(Roles)
		private readonly rolesRepository: Repository<Roles>,
	) {}

	findAll(query: GetUserDto) {
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

		return conditionUtils(queryBuilder, obj).take(take).skip(skip).getMany();
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
		return this.userRepository.findOne({
			where: { username },
			relations: {
				roles: {
					menus: true,
				},
			},
		});
	}

	findOne(id: number) {
		return this.userRepository.findOne({ where: { id } });
	}

	async create(user: CreateUserDto) {
		let roles: Roles[] = [];
		if (user.roles instanceof Array && typeof user.roles[0] === 'number') {
			roles = await this.rolesRepository.find({
				where: {
					id: In(user.roles as number[]),
				},
			});
			// 默认给一个 普通用户 的角色
		} else {
			roles[0] = await this.rolesRepository.findOne({
				where: {
					id: 3,
				},
			});
		}
		//  Creates a new instance of User. Optionally accepts an object literal
		//  with user properties which will be written into newly created user object
		const userTmp = await this.userRepository.create({ ...user, roles });
		userTmp.password = await argon2.hash(userTmp.password);
		return await this.userRepository.save(userTmp);
	}

	async update(id: number, dto: any) {
		const userTemp = await this.findProfile(id);
		const newUser = this.userRepository.merge(userTemp, dto);
		return this.userRepository.save(newUser);
	}

	async remove(id: number) {
		try {
			await this.userRepository.softDelete(id);
		} catch (e) {
			console.info('UserService caught an error when remove user.', e);
		}
	}

	async restore(id: number) {
		try {
			await this.userRepository.restore(id);
			// console.log('[user.service.ts:] ', await this.findOne(id));
			return await this.findOne(id);
		} catch (e) {
			console.info('UserService caught an error when restore user.', e);
		}
	}

	findProfile(id: number): Promise<User> {
		return this.userRepository.findOne({
			where: { id },
			relations: { profile: true },
		});
	}
}
