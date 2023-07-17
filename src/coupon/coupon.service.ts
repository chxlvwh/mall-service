import { Injectable } from '@nestjs/common';
import { Coupon, CouponStatus } from './entity/coupon.entity';
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
import { ProductService } from '../product/product.service';
import { ProductCategoryService } from '../product-category/product-category.service';
import { ProductCategory } from '../product-category/product-category.entity';

@Injectable()
export class CouponService {
	constructor(
		@InjectRepository(Coupon) private readonly couponRepository: Repository<Coupon>,
		@InjectRepository(CouponItem) private readonly couponItemRepository: Repository<CouponItem>,
		private readonly userService: UserService,
		private dataSource: DataSource,
		private productService: ProductService,
		private productCategoryService: ProductCategoryService,
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
			new Date(endDate).getTime() > now.getTime()
		) {
			coupon.status = 'ONGOING';
		}
		if (startDate && new Date(startDate).getTime() > now.getTime()) {
			coupon.status = 'NOT_STARTED';
		}
		if (endDate && new Date(endDate).getTime() < now.getTime()) {
			coupon.status = 'EXPIRED';
		}
		const { scope, productIds, categoryIds } = createCouponDto;
		if (scope === 'PRODUCT') {
			const products = await this.productService.findByIds(productIds);
			if (!products.length) {
				throw new Error('No product found');
			}
			coupon.products = products;
		} else if (scope === 'CATEGORY') {
			const categories = await this.productCategoryService.findByIds(categoryIds);
			if (!categories.length) {
				throw new Error('No category found');
			}
			coupon.categories = categories;
		}
		return await this.couponRepository.save(coupon);
	}

	async findAll(searchCouponDto: SearchCouponDto) {
		const { name, status, endDate, startDate, scope, type, current, pageSize, sortBy, sortOrder } = searchCouponDto;
		const { take, skip } = formatPageProps(current, pageSize);
		let queryBuilder = this.couponRepository.createQueryBuilder('coupon');

		if (startDate && endDate) {
			queryBuilder = queryBuilder.andWhere(
				':start >= coupon.startDate AND :start <= coupon.endDate OR (:end >= coupon.startDate AND :end <= coupon.endDate)',
				{
					start: new Date(startDate),
					end: new Date(endDate),
				},
			);
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
		const [data] = queryResult;
		if (data.length) {
			for (const item of data) {
				if (new Date().getTime() > new Date(item.endDate).getTime() && item.status === CouponStatus.ONGOING) {
					item.status = CouponStatus.EXPIRED;
					await this.couponRepository.save(item);
				}
			}
		}
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
			coupon = await this.couponRepository.findOne({
				where: { id: couponId },
				relations: ['couponItems', 'products', 'categories'],
			});
		} else {
			coupon = await this.couponRepository.findOne({
				where: { id: couponId },
				relations: {
					products: true,
					categories: {
						parent: true,
					},
				},
			});
		}
		if (!coupon) {
			throw new Error('Coupon not found');
		}
		return coupon;
	}
}
