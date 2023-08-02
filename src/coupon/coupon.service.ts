import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { Coupon, CouponScope, CouponStatus } from './entity/coupon.entity';
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
import { compareDesc } from 'date-fns';

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

	processStatus(coupon: Coupon, startDate, endDate) {
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
	}

	async processProductAndCategory(coupon: Coupon, scope, productIds: number[], categoryIds: number[]) {
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
	}

	async generateCoupon(createCouponDto: CreateCouponDto) {
		const coupon = this.couponRepository.create(createCouponDto);
		coupon.couponItems = [];

		if (coupon.quantity === 0) {
			throw new Error('Quantity can not be 0');
		}

		const { startDate, endDate } = coupon;
		this.processStatus(coupon, startDate, endDate);
		const { scope, productIds, categoryIds } = createCouponDto;
		await this.processProductAndCategory(coupon, scope, productIds, categoryIds);
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
				if (
					compareDesc(new Date(item.endDate), new Date()) === 1 &&
					(item.status === CouponStatus.NOT_STARTED || item.status === CouponStatus.ONGOING)
				) {
					item.status = CouponStatus.EXPIRED;
					await this.couponRepository.save(item);
				}
				if (
					compareDesc(new Date(item.startDate), new Date()) === 1 &&
					item.status === CouponStatus.NOT_STARTED
				) {
					item.status = CouponStatus.ONGOING;
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
		coupon.startDate = startDate || coupon.startDate;
		coupon.endDate = endDate || coupon.endDate;
		this.processStatus(coupon, coupon.startDate, coupon.endDate);
		const { scope } = coupon;
		const { productIds, categoryIds } = updateCouponDto;
		await this.processProductAndCategory(coupon, scope, productIds, categoryIds);
		return await this.couponRepository.save(coupon);
	}

	// findCouponById
	async findCouponById(id: number) {
		return await this.couponRepository.findOne({ where: { id }, withDeleted: true });
	}

	// 领取优惠券
	async receiveCoupon(userId: number, couponId: number) {
		const coupon = await this.couponRepository.findOne({
			where: { id: couponId },
			relations: { couponItems: { user: true } },
		});
		if (coupon.couponItems.length >= coupon.quantity) {
			throw new ConflictException('已被抢光了~');
		}
		const userReceivedCoupons = coupon.couponItems.filter((item) => item.user[0].id === userId);
		if (userReceivedCoupons.length >= coupon.quantityPerUser) {
			throw new ConflictException('已经领取过了~');
		}
		const user = await this.userService.findOne(userId);
		if (!coupon) {
			throw new BadRequestException('Coupon not found');
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

	// 获取已领取的优惠券
	async getCouponItems(couponId: number) {
		const coupon = await this.couponRepository.findOne({ where: { id: couponId }, relations: ['couponItems'] });
		if (!coupon) {
			throw new Error('Coupon not found');
		}
		return coupon.couponItems;
	}

	// 获取优惠券详情
	async findOne(couponId: number, searchCouponDetailDto?: SearchCouponDetailDto) {
		if (!couponId) {
			throw new Error('Coupon id is required');
		}
		let coupon;
		if (searchCouponDetailDto && searchCouponDetailDto.withCouponItems) {
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

	// 删除优惠券
	async deleteCoupon(id: number) {
		const coupon = await this.findCouponById(id);
		if (!coupon) {
			throw new Error('Coupon not found');
		}
		return await this.couponRepository.softRemove(coupon);
	}

	// 获取产品可领取优惠券
	async getValidCoupons(productId) {
		const product = await this.productService.findOne(productId);
		if (!product) {
			return [];
		}
		const productCategory = product.productCategory;
		const queryBuilder = this.couponRepository
			.createQueryBuilder('coupon')
			.leftJoinAndSelect('coupon.products', 'products')
			.leftJoinAndSelect('coupon.categories', 'categories')
			.andWhere('coupon.endDate >= :current', { current: new Date() })
			.andWhere('coupon.status = :status1 || coupon.status = :status2', {
				status1: CouponStatus.ONGOING,
				status2: CouponStatus.NOT_STARTED,
			});

		const coupons = await queryBuilder.orderBy('coupon.createdAt', 'DESC').getMany();
		if (coupons.length) {
			const validCoupons = [];
			for (const coupon of coupons) {
				const { scope } = coupon;
				const { categories, products } = coupon;
				const categoryIds = categories.map((item) => item.id);
				const productIds = products.map((item) => item.id);
				if (scope === CouponScope.ALL) {
					validCoupons.push(coupon);
				} else if (scope === CouponScope.PRODUCT && productIds.includes(productId)) {
					validCoupons.push(coupon);
				} else if (scope === CouponScope.CATEGORY) {
					const category = await this.productCategoryService.findOne(productCategory.id);
					const parentCategory = category.parent;
					if (
						categoryIds.includes(productCategory.id) ||
						(parentCategory && categoryIds.includes(parentCategory.id))
					) {
						validCoupons.push(coupon);
					}
				}
			}
			return validCoupons.map((item) => {
				return {
					...item,
					products: undefined,
					categories: undefined,
				};
			});
		} else {
			return [];
		}
	}
}
