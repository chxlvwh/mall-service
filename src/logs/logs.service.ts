import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logs } from './logs.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LogsService {
	constructor(
		@InjectRepository(Logs)
		private readonly logsRepository: Repository<Logs>,
	) {}

	async findAll() {
		return await this.logsRepository
			.createQueryBuilder('logs')
			.leftJoinAndSelect('logs.user', 'user')
			.where('logs.userId=:id', { id: 1 })
			.getMany();
	}
}
