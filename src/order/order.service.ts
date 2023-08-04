import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entity/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem, OrderItemStatus } from './entity/order-item.entity';
import { PreviewOrderDto } from './dto/preview-order.dto';
import { CouponService } from '../coupon/coupon.service';
import { UserService } from '../user/services/user.service';
import { Coupon, CouponScope } from '../coupon/entity/coupon.entity';
import { ProductService } from '../product/product.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { format } from 'date-fns';
import { SearchOrderDto } from './dto/search-order.dto';
import { conditionUtils, pagingFormat } from '../utils/db.helper';
import { formatPageProps } from '../utils/common';

@Injectable()
export class OrderService {
	constructor(
		@InjectRepository(Order) private readonly orderRepository: Repository<Order>,
		@InjectRepository(OrderItem) private readonly orderItemRepository: Repository<OrderItem>,
		private readonly couponService: CouponService,
		private readonly userService: UserService,
		private readonly productService: ProductService,
	) {}

	// 查询用户订单列表
	async findAllByUserId(userId: number, status: string) {
		const queryBuilder = this.orderRepository
			.createQueryBuilder('order')
			.leftJoinAndSelect('order.receiver', 'receiver')
			.leftJoinAndSelect('order.user', 'user')
			.leftJoinAndSelect('order.items', 'items')
			.leftJoinAndSelect('items.product', 'product')
			.leftJoinAndSelect('items.sku', 'sku')
			.where('order.user = :userId', { userId })
			.orderBy('order.createdAt', 'DESC');
		switch (status) {
			// 待付款
			case '1':
				queryBuilder.andWhere('order.status = :status', { status: OrderStatus.UNPAID });
				break;
			// 待发货
			case '2':
				queryBuilder.andWhere('order.status = :status', { status: OrderStatus.DELIVERING });
				break;
			// 待收货
			case '3':
				queryBuilder.andWhere('order.status = :status', { status: OrderStatus.DELIVERED });
				break;
			// 待评价
			case '4':
				queryBuilder.andWhere('order.status = :status', { status: OrderStatus.COMMENTING });
		}

		const queryResult = await queryBuilder.getManyAndCount();

		return pagingFormat(queryResult, 1, 10);
	}

	// 查询订单列表
	async findAll(searchOrderDto: SearchOrderDto) {
		const {
			orderNo,
			status,
			startDate,
			endDate,
			username,
			pageSize,
			sortBy,
			sortOrder,
			current,
			paymentMethod,
			orderSource,
		} = searchOrderDto;
		const { take, skip } = formatPageProps(current, pageSize);
		const queryBuilder = this.orderRepository
			.createQueryBuilder('order')
			.leftJoinAndSelect('order.receiver', 'receiver')
			.leftJoinAndSelect('order.user', 'user');

		const queryObj = {
			'order.orderSource': { value: orderSource },
			'order.paymentMethod': { value: paymentMethod },
			'order.orderNo': { value: orderNo },
			'order.status': { value: status },
			'user.username': { value: username, isLike: true },
		};
		if (startDate && endDate) {
			queryBuilder.andWhere(`order.createdAt BETWEEN :startDate AND :endDate`, {
				startDate,
				endDate,
			});
		}

		const queryResult = await conditionUtils(queryBuilder, queryObj)
			.take(take)
			.skip(skip)
			.orderBy(`order.${sortBy || 'createdAt'}`, sortOrder || 'DESC')
			.getManyAndCount();

		return pagingFormat(queryResult, current, pageSize);
	}

	// 查询订单
	async findOne(orderNo: string) {
		return await this.orderRepository.findOne({
			where: { orderNo },
			relations: {
				items: {
					product: { brand: true },
					sku: true,
					coupon: true,
				},
			},
		});
	}

	// 根据userId查询订单
	async findOrderByUserId(orderNo: string, userId: number) {
		return await this.orderRepository.findOne({
			where: { user: { id: userId }, orderNo },
			relations: {
				items: {
					product: { brand: true },
					sku: true,
					coupon: true,
				},
			},
		});
	}

	// 生成订单
	async createOrder(userId: number, createOrderDto: CreateOrderDto, orderSource: string) {
		const { products, receiverId, remark, generalCouponId, totalPrice } = createOrderDto;
		const previewOrder = await this.previewOrder(userId, {
			products: products.map((p) => {
				return {
					id: p.id,
					skuId: p.sku && p.sku.id,
					count: p.count,
				};
			}) as PreviewOrderDto['products'],
		});
		if (previewOrder.totalPrice !== totalPrice) {
			throw new Error('Total price not match');
		}
		const order = this.orderRepository.create();
		order.orderNo = format(new Date(), 'yyyyMMddHHmmssSSS');
		order.remark = remark;
		order.totalPrice = totalPrice;
		order.status = OrderStatus.UNPAID;
		order.orderSource = orderSource;
		const user = await this.userService.findOne(userId);
		const receiver = await this.userService.findReceiverById(receiverId);
		await this.orderRepository.save(order);

		const qb = this.orderRepository.createQueryBuilder('order');
		await qb.relation('user').of(order).set(user);
		await qb.relation('receiver').of(order).set(receiver);
		if (generalCouponId) {
			const generalCoupon = await this.couponService.findOne(generalCouponId);
			await qb.relation('generalCoupon').of(order).add(generalCoupon);
		}

		const orderItems = [];
		for (let i = 0; i < products.length; i++) {
			const orderItem = this.orderItemRepository.create();
			orderItem.quantity = products[i].count;
			orderItem.totalPrice = products[i].totalPrice;
			orderItem.discountedTotalPrice = products[i].discountedTotalPrice;
			orderItem.basePrice = products[i].basePrice;
			// orderItem.totalPrice = products[i].totalPrice;
			orderItem.status = OrderItemStatus.NOT_DELIVERED;
			await this.orderItemRepository.save(orderItem);

			const qb = this.orderItemRepository.createQueryBuilder('orderItem');
			const product = await this.productService.findOne(products[i].id);
			await qb.relation('product').of(orderItem).set(product);
			if (products[i].sku) {
				const sku = await this.productService.getSkuById(products[i].sku.id);
				await qb.relation('sku').of(orderItem).set(sku);
			}
			if (products[i].couponId) {
				const coupon = await this.couponService.findOne(products[i].couponId);
				await qb.relation('coupon').of(orderItem).add(coupon);
			}
			orderItems.push(orderItem);
			await qb.execute();
		}
		await qb.relation('items').of(order).add(orderItems);
		await qb.execute();
		return order.orderNo;
	}

	// 生成预览订单
	async previewOrder(userId: number, { products }: PreviewOrderDto) {
		const productIds = products.map((product) => product.id);
		const productWithCoupons: { [key: string]: Coupon[] } = {};
		// 查询用户所有可用的优惠券
		const userCouponItems = await this.userService.findCouponItems(userId);
		console.log('[userCouponItems:] ', userCouponItems);
		// 找出所有的全场券
		const generalCoupons = userCouponItems.filter((item) => item.coupon.scope === CouponScope.ALL);
		// 找出所有的商品券
		const productCoupons = userCouponItems.filter((item) => item.coupon.scope === CouponScope.PRODUCT);
		// 找出所有的分类券
		const categoryCoupons = userCouponItems.filter((item) => item.coupon.scope === CouponScope.CATEGORY);

		const setCoupon = (id: number, coupon: Coupon) => {
			if (!productWithCoupons[id]) {
				productWithCoupons[id] = [];
			}
			productWithCoupons[id].push(coupon);
		};

		// 找出商品优惠券对应的商品
		for (let i = 0; i < productCoupons.length; i++) {
			const coupon = await this.couponService.findOne(productCoupons[i].coupon.id);
			const pIds = coupon.products.map((product) => product.id);
			productIds.forEach((id) => {
				if (pIds.includes(id)) {
					setCoupon(id, coupon);
				}
			});
		}

		// 找出商品所属分类
		for (let i = 0; i < productIds.length; i++) {
			const product = await this.productService.findOne(productIds[i]);
			// 商品分类
			const productCategory = product.productCategory;

			// 找出分类优惠券对应的分类
			for (let j = 0; j < categoryCoupons.length; j++) {
				const coupon = await this.couponService.findOne(categoryCoupons[j].coupon.id);
				const categories = coupon.categories;
				categories.forEach((category) => {
					if (category.id === productCategory.id) {
						setCoupon(product.id, coupon);
					} else if (category.parent && !productCategory.parent) {
						if (category.parent.id === productCategory.id) {
							setCoupon(product.id, coupon);
						}
					} else if (!category.parent && productCategory.parent) {
						if (category.id === productCategory.id) {
							setCoupon(product.id, coupon);
						}
					} else if (category.parent && productCategory.parent) {
						if (category.parent.id === productCategory.parent.id) {
							setCoupon(product.id, coupon);
						}
					}
				});
			}
		}

		const result = {
			products: [],
			totalPrice: 0,
			generalCoupon: null,
		};

		const consumedCoupons: number[] = [];
		for (let i = 0; i < products.length; i++) {
			let salePrice = 0;
			let sku = null;
			if (products[i].skuId) {
				sku = await this.productService.getSkuById(products[i].skuId);
				salePrice = sku && sku.price;
			} else {
				const product = await this.productService.findOne(products[i].id);
				salePrice = product && product.salePrice;
			}
			const coupons = productWithCoupons[products[i].id] || [];
			let maxDiscount = 0;
			let maxCoupon = null;
			const totalPriceWithoutCoupon = salePrice * products[i].count;
			coupons.forEach((coupon) => {
				if (consumedCoupons.includes(coupon.id)) {
					return;
				}
				if (coupon.threshold <= totalPriceWithoutCoupon) {
					if (coupon.value > maxDiscount) {
						maxDiscount = coupon.value;
						maxCoupon = coupon;
					}
				}
			});
			if (maxCoupon) {
				consumedCoupons.push(maxCoupon.id);
			}
			const product = await this.productService.findOne(products[i].id);
			result.products.push({
				name: product.name,
				id: products[i].id,
				sku,
				coupon: maxCoupon && {
					...maxCoupon,
					categories: undefined,
				},
				discount: maxDiscount,
				totalPrice: totalPriceWithoutCoupon,
				discountedTotalPrice: totalPriceWithoutCoupon - maxDiscount,
				basePrice: salePrice,
				cover: product.coverUrls && product.coverUrls[0],
			});
		}

		const totalPriceWithoutGeneralCoupon = result.products.reduce((acc, cur) => {
			return acc + cur.discountedTotalPrice;
		}, 0);

		let maxDiscount = 0;
		let maxCoupon = null;
		generalCoupons.forEach((couponItem) => {
			const coupon = couponItem.coupon;
			if (coupon.threshold <= totalPriceWithoutGeneralCoupon) {
				if (coupon.value > maxDiscount) {
					maxDiscount = coupon.value;
					maxCoupon = coupon;
				}
			}
		});
		result.totalPrice = totalPriceWithoutGeneralCoupon - maxDiscount;
		result.generalCoupon = maxCoupon && {
			...maxCoupon,
			categories: undefined,
		};

		return result;
	}
}
