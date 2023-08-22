import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seckill } from './seckill.entity';
import { Repository } from 'typeorm';
import { SeckillPeriod } from './seckill-period.entity';
import { SearchSeckillDto } from './dto/search-seckill.dto';
import { formatPageProps } from '../utils/common';
import { conditionUtils, pagingFormat } from '../utils/db.helper';
import { CreateSeckillDto } from './dto/create-seckill.dto';
import { UpdateSeckillDto } from './dto/update-seckill.dto';
import { CreatePeriodDto } from './dto/create-period.dto';
import { format } from 'date-fns';

@Injectable()
export class SeckillService {
	constructor(
		@InjectRepository(Seckill)
		private readonly seckillRepository: Repository<Seckill>,
		@InjectRepository(SeckillPeriod)
		private readonly seckillPeriodRepository: Repository<SeckillPeriod>,
	) {}

	async findAll(query: SearchSeckillDto) {
		const { name, pageSize, sortOrder, sortBy, current } = query;
		const { take, skip } = formatPageProps(current, pageSize);
		const queryBuilder = this.seckillRepository
			.createQueryBuilder('seckill')
			.leftJoinAndSelect('seckill.seckillPeriods', 'period');
		const queryObj = {
			'seckill.name': { value: name, isLike: true },
		};
		const result = await conditionUtils(queryBuilder, queryObj)
			.take(take)
			.skip(skip)
			.orderBy(`seckill.${sortBy || 'createdAt'}`, sortOrder || 'DESC')
			.getManyAndCount();

		return pagingFormat(result, current, pageSize);
	}

	async findById(id: number) {
		return await this.seckillRepository.findOne({ where: { id }, relations: ['seckillPeriods'] });
	}

	async getSeckillById(id: number) {
		const seckill = this.seckillRepository.findOne({ where: { id } });
		if (!seckill) {
			throw new NotFoundException('活动不存在');
		}
		return await this.seckillRepository.findOne({ where: { id }, relations: ['seckillPeriods'] });
	}

	async generateDefaultPeriod(seckill) {
		const defaultPeriods = [
			['08:00:00', '10:00:00'],
			['10:00:00', '12:00:00'],
			['12:00:00', '14:00:00'],
			['14:00:00', '16:00:00'],
			['16:00:00', '18:00:00'],
			['18:00:00', '20:00:00'],
			['20:00:00', '22:00:00'],
		];
		const periods = defaultPeriods.map((period) => {
			return {
				name: period[0],
				startTime: period[0],
				endTime: period[1],
				enable: true,
				seckill,
			};
		});
		await this.seckillPeriodRepository.save(periods);
	}

	async create(body: CreateSeckillDto) {
		const entity = await this.seckillRepository.create(body);
		const seckill = await this.seckillRepository.save(entity);
		await this.generateDefaultPeriod(seckill);
		return seckill;
	}

	async update(id: number, body: UpdateSeckillDto) {
		const seckill = this.seckillRepository.findOne({ where: { id } });
		if (!seckill) {
			throw new NotFoundException('活动不存在');
		}
		return await this.seckillRepository.update(id, body);
	}

	async remove(id: number) {
		const seckill = await this.seckillRepository.findOne({ where: { id }, relations: { seckillPeriods: true } });
		if (!seckill) {
			throw new NotFoundException('活动不存在');
		}
		const seckillPeriods = seckill.seckillPeriods;
		await this.seckillPeriodRepository.softRemove(seckillPeriods);
		return await this.seckillRepository.softRemove(seckill);
	}

	async createPeriod(seckillId: number, body: CreatePeriodDto) {
		const seckill = await this.seckillRepository.findOne({
			where: { id: seckillId },
			relations: ['seckillPeriods'],
		});
		const { seckillPeriods } = seckill;
		if (new Date(body.startTime).getTime() >= new Date(body.endTime).getTime()) {
			throw new BadRequestException('开始时间应该小于结束时间');
		}
		for (let i = 0; i < seckillPeriods.length; i++) {
			const period = seckillPeriods[i];
			if (
				!(
					new Date(period.endTime).getTime() < new Date(body.startTime).getTime() ||
					new Date(period.startTime).getTime() > new Date(body.endTime).getTime()
				)
			) {
				throw new BadRequestException('时间跟已有时间重叠');
			}
		}
		const seckillPeriod = this.seckillPeriodRepository.create(body);
		seckillPeriods.concat(seckillPeriod);
		seckill.seckillPeriods = seckillPeriods.concat(seckillPeriod);
		await this.seckillRepository.save(seckill);
	}

	async updatePeriod(seckillId: number, id: number, body: CreatePeriodDto) {
		const seckillPeriod = await this.seckillPeriodRepository.findOneBy({ id, seckill: { id: seckillId } });
		if (!seckillPeriod) {
			throw new NotFoundException('时间段不存在');
		}
		const newBody = Object.assign(seckillPeriod, body);
		return await this.seckillPeriodRepository.save(newBody);
	}

	async deletePeriod(seckillId: number, id: number) {
		const seckillPeriod = await this.seckillPeriodRepository.findOneBy({ id, seckill: { id: seckillId } });
		if (!seckillPeriod) {
			throw new NotFoundException('时间段不存在');
		}
		return await this.seckillPeriodRepository.delete(id);
	}
}