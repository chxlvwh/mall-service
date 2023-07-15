import { Injectable } from '@nestjs/common';
import { Coupon } from './entity/coupon.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CouponItem } from './entity/coupon-item.entity';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { SearchCouponDto } from './dto/search-coupon.dto';
import { formatPageProps } from '../utils/common';
import { conditionUtils, pagingFormat } from '../utils/db.helper';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { UserService } from '../user/services/user.service';
import { SearchCouponDetailDto } from './dto/search-coupon-detail.dto';

@Injectable()
export class CouponService {
	constructor(
		@InjectRepository(Coupon) private readonly couponRepository: Repository<Coupon>,
		@InjectRepository(CouponItem) private readonly couponItemRepository: Repository<CouponItem>,
		private readonly userService: UserService,
		private dataSource: DataSource,
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
		let queryBuilder = this.couponRepository.createQueryBuilder('coupon');

		if (startDate) {
			queryBuilder = queryBuilder.andWhere('coupon.endDate >= :start', { start: new Date(startDate) });
		}
		if (endDate) {
			queryBuilder = queryBuilder.andWhere('coupon.startDate <= :end', { end: new Date(endDate) });
		}

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

	// 更新优惠券
	async updateCoupon(id: number, updateCouponDto: UpdateCouponDto) {
		const coupon = await this.findCouponById(id);
		if (!coupon) {
			throw new Error('Coupon not found');
		}
		const { startDate, endDate } = updateCouponDto;
		coupon.startDate = startDate ? new Date(startDate) : coupon.startDate;
		coupon.endDate = endDate ? new Date(endDate) : coupon.endDate;
		return await this.couponRepository.save(coupon);
	}

	// findCouponById
	async findCouponById(id: number) {
		return await this.couponRepository.findOne({ where: { id } });
	}

	// 领取优惠券
	async receiveCoupon(userId: number, couponId: number) {
		const coupon = await this.findCouponById(couponId);
		const user = await this.userService.findOne(userId);
		// const userCouponItems = await this.userService.findCouponItems(userId);
		// console.log('[userCouponItems:] ', userCouponItems);
		if (!coupon) {
			throw new Error('Coupon not found');
		}
		const couponItem = this.couponItemRepository.create();
		couponItem.receivedDate = new Date();
		couponItem.code = `${couponId}-${userId}-${new Date().getTime()}`;
		couponItem.coupon = coupon;
		couponItem.user = user;
		const savedCoupon = await this.couponItemRepository.save(couponItem);
		// 保存多对多关联表
		const qb = this.couponItemRepository.createQueryBuilder('couponItem');
		await qb.relation('user').of(couponItem).add(user);
		await qb.execute();

		return await this.couponItemRepository.findOne({ where: { id: savedCoupon.id } });
	}

	// 获取领取的优惠券
	async getCouponItems(couponId: number) {
		const coupon = await this.couponRepository.findOne({ where: { id: couponId }, relations: ['couponItems'] });
		if (!coupon) {
			throw new Error('Coupon not found');
		}
		return coupon.couponItems;
	}

	// 获取优惠券详情
	async findOne(couponId: number, searchCouponDetailDto: SearchCouponDetailDto) {
		let coupon;
		if (searchCouponDetailDto.withCouponItems) {
			coupon = await this.couponRepository.findOne({ where: { id: couponId }, relations: ['couponItems'] });
		} else {
			coupon = await this.couponRepository.findOne({ where: { id: couponId } });
		}
		if (!coupon) {
			throw new Error('Coupon not found');
		}
		return coupon;
	}
}
