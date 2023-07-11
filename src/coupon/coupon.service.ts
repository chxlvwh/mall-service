import { Injectable } from '@nestjs/common';
import { Coupon } from './entity/coupon.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CouponItem } from './entity/coupon-item.entity';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { SearchCouponDto } from './dto/search-coupon.dto';
import { formatPageProps } from '../utils/common';
import { conditionUtils, pagingFormat } from '../utils/db.helper';

@Injectable()
export class CouponService {
	constructor(
		@InjectRepository(Coupon) private readonly couponRepository: Repository<Coupon>,
		@InjectRepository(CouponItem) private readonly couponItemRepository: Repository<CouponItem>,
	) {}

	async generateCoupon(createCouponDto: CreateCouponDto) {
		const coupon = this.couponRepository.create(createCouponDto);
		coupon.couponItems = [];

		if (coupon.quantity === 0) {
			throw new Error('Quantity can not be 0');
		}

		const { startDate, endDate } = coupon;
		const now = new Date();
		if (
			startDate &&
			new Date(startDate).getTime() < now.getTime() &&
			endDate &&
			new Date(endDate).getTime() < now.getTime()
		) {
			coupon.status = 'ONGOING';
		}
		if (startDate && new Date(startDate).getTime() > now.getTime()) {
			coupon.status = 'NOT_STARTED';
		}
		if (endDate && new Date(endDate).getTime() < now.getTime()) {
			coupon.status = 'ENDED';
		}
		return await this.couponRepository.save(coupon);
	}

	async findAll(searchCouponDto: SearchCouponDto) {
		const { name, status, endDate, startDate, scope, type, current, pageSize, sortBy, sortOrder } = searchCouponDto;
		const { take, skip } = formatPageProps(current, pageSize);
		const queryBuilder = this.couponRepository.createQueryBuilder('coupon');

		const queryObj = {
			'coupon.name': { value: name, isLike: true },
			'coupon.status': { value: status },
			'coupon.scope': { value: scope },
			'coupon.type': { value: type },
		};
		const queryResult = await conditionUtils(queryBuilder, queryObj)
			.take(take)
			.skip(skip)
			.orderBy(`coupon.${sortBy || 'createdAt'}`, sortOrder || 'DESC')
			.getManyAndCount();
		return pagingFormat(queryResult, current, pageSize);
	}
}
