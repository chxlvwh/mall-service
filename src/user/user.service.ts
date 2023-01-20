import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { getUserDto } from './dto/get-users.dto';
import { conditionUtils } from '../utils/db.helper';
import { CreateUserDto } from './dto/create-user.dto';

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

	findOne(id: number) {
		return this.userRepository.findOne({ where: { id } });
	}

	async create(createUserDto: CreateUserDto) {
		//  Creates a new instance of User. Optionally accepts an object literal
		//  with user properties which will be written into newly created user object
		const userTmp = await this.userRepository.create(createUserDto);
		return await this.userRepository.save(userTmp);
	}

	async update(id: number, dto: any) {
		const userTemp = await this.findProfile(id);
		const newUser = this.userRepository.merge(userTemp, dto);
		return this.userRepository.save(newUser);
	}

	async remove(id: number) {
		const user = await this.findOne(id);
		return this.userRepository.remove(user);
	}

	findProfile(id: number): Promise<User> {
		return this.userRepository.findOne({
			where: { id },
			relations: { profile: true },
		});
	}
}
