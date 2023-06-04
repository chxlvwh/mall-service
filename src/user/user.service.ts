import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { DataSource, In, IsNull, Not, Repository } from 'typeorm';
import { GetUserDto } from './dto/get-users.dto';
import { conditionUtils } from '../utils/db.helper';
import { Roles } from '../roles/roles.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon2 from 'argon2';
import { Profile } from './profile.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(Roles)
		private readonly rolesRepository: Repository<Roles>,
		private dataSource: DataSource,
	) {}

	async findAll(query: GetUserDto) {
		const { pageSize, current, username, gender, role, nickname, email, isDeleted } = query;
		const take = pageSize || 10;
		const skip = ((current || 1) - 1) * take;
		let queryBuilder = this.userRepository
			.createQueryBuilder('user')
			.leftJoinAndSelect('user.profile', 'profile')
			.leftJoinAndSelect('user.roles', 'roles');
		if (!isDeleted) {
			queryBuilder = queryBuilder.withDeleted();
		} else if (isDeleted === '1') {
			queryBuilder = queryBuilder.withDeleted().where({ deletedAt: Not(IsNull()) });
		}

		const obj = {
			'user.username': { value: username, isLike: true },
			'profile.gender': { value: gender, isLike: true },
			'profile.nickname': { value: nickname, isLike: true },
			'profile.email': { value: email, isLike: true },
			'roles.id': { value: role },
		};

		const queryResult = await conditionUtils(queryBuilder, obj).take(take).skip(skip).getManyAndCount();

		return {
			elements: queryResult[0],
			paging: {
				current,
				pageSize,
				total: queryResult[1],
			},
		};
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
		return this.userRepository.findOne({
			where: { id },
			relations: { profile: true, roles: true },
			withDeleted: true,
		});
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
		// Creates a new instance of User. Optionally accepts an object literal
		// with user properties which will be written into newly created user object
		// 创建事务
		return await this.dataSource.transaction(async (manager) => {
			// 先存主表
			// save方法保存后返回的是一个 User 对象
			const newUser = await manager.save(User, {
				...{ ...user, password: await argon2.hash(user.password) },
				roles,
			});
			const profile = new Profile();
			profile.gender = user.gender;
			profile.address = user.address;
			profile.avatar = user.avatar;
			profile.email = user.email;
			profile.nickname = user.nickname;
			profile.user = newUser;
			await manager.insert(Profile, profile);
			if (user.isDeleted && user.isDeleted.toString() === '1') {
				await manager.softDelete(User, newUser.id);
			}
			return manager.findOne(User, { where: { id: newUser.id }, relations: { profile: true } });
		});
	}

	async update(id: number, updateUserDto: UpdateUserDto) {
		const userTemp = await this.findProfile(id);
		return await this.dataSource.transaction(async (manager) => {
			const user = new User();
			user.username = updateUserDto.username || userTemp.username;
			// 先更新主表
			await manager.update(User, id, user);
			const profile = userTemp.profile;
			profile.gender = updateUserDto.gender;
			profile.address = updateUserDto.address;
			profile.avatar = updateUserDto.avatar;
			profile.email = updateUserDto.email;
			profile.nickname = updateUserDto.nickname;
			await manager.update(Profile, profile.id, profile);
			if (!userTemp.deletedAt && updateUserDto.isDeleted && updateUserDto.isDeleted.toString() === '1') {
				await manager.softDelete(User, id);
			}
			return manager.findOne(User, { where: { id }, relations: { profile: true } });
		});
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

	// updateProfile(profile: Partial<Profile>): Profile<Profile> {
	// 	return this.userRepository
	// }
}
