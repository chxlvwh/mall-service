import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Order, OrderStatus } from './entity/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem, OrderItemStatus } from './entity/order-item.entity';
import { PreviewOrderDto } from './dto/preview-order.dto';
import { CouponService } from '../coupon/coupon.service';
import { UserService } from '../user/services/user.service';
import { CouponScope } from '../coupon/entity/coupon.entity';
import { ProductService } from '../product/product.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { format } from 'date-fns';
import { SearchOrderDto } from './dto/search-order.dto';
import { conditionUtils, pagingFormat } from '../utils/db.helper';
import { formatPageProps } from '../utils/common';
import { CouponItem } from '../coupon/entity/coupon-item.entity';
import { Product } from '../product/entity/product.entity';

@Injectable()
export class OrderService {
	constructor(
		@InjectRepository(Order) private readonly orderRepository: Repository<Order>,
		@InjectRepository(OrderItem) private readonly orderItemRepository: Repository<OrderItem>,
		@InjectRepository(Product) private readonly productRepository: Repository<Product>,
		private readonly couponService: CouponService,
		private readonly userService: UserService,
		private readonly productService: ProductService,
		private readonly dataSource: DataSource,
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
				generalCouponItem: { coupon: true },
				receiver: true,
				items: {
					product: { brand: true },
					sku: true,
					couponItem: { coupon: true },
				},
			},
		});
	}

	// 根据userId查询订单
	async findOrderByUserId(orderNo: string, userId: number) {
		return await this.orderRepository.findOne({
			where: { orderNo, user: { id: userId } },
			relations: {
				generalCouponItem: { coupon: true },
				receiver: true,
				items: {
					product: { brand: true },
					sku: true,
					couponItem: { coupon: true },
				},
			},
		});
	}

	// 校验产品库存
	async checkProductStock(products: PreviewOrderDto['products']) {
		for (let i = 0; i < products.length; i++) {
			if (!products[i].skuId) {
				const product = await this.productService.findOne(products[i].id);
				if (product.stock < products[i].count) {
					throw new Error('库存不足');
				}
			}
			const sku = await this.productService.getSkuById(products[i].skuId);
			if (sku.stock < products[i].count) {
				throw new Error('库存不足');
			}
		}
	}

	// 生成订单
	async createOrder(userId: number, createOrderDto: CreateOrderDto, orderSource: string) {
		const { products, receiverId, remark, generalCouponId, totalPrice, generalCouponItemId } = createOrderDto;
		const previewOrderProducts = products.map((p) => {
			return {
				id: p.id,
				skuId: p.sku && p.sku.id,
				count: p.count,
			};
		}) as PreviewOrderDto['products'];
		const previewOrder = await this.previewOrder(userId, {
			products: previewOrderProducts,
		});
		if (previewOrder.totalPrice !== totalPrice) {
			throw new Error('Total price not match');
		}
		await this.checkProductStock(previewOrderProducts);
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
		// 将优惠券设置为已使用
		if (generalCouponItemId) {
			const generalCouponItem = await this.couponService.findCouponItemById(generalCouponItemId);
			generalCouponItem.isUsed = true;
			generalCouponItem.usedDate = new Date();
			order.generalCouponItem = generalCouponItem;
			await this.couponService.updateCouponItem(generalCouponItem);
			await qb.relation('generalCouponItem').of(order).set(generalCouponItem);
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

			const qb1 = this.orderItemRepository.createQueryBuilder('orderItem');
			const product = await this.productService.findOne(products[i].id);
			await qb1.relation('product').of(orderItem).set(product);
			product.stock -= products[i].count;
			product.sales += products[i].count;
			await this.productRepository.save(product);
			if (products[i].sku) {
				const sku = await this.productService.getSkuById(products[i].sku.id);
				sku.stock -= products[i].count;
				await this.productService.saveSku(sku);
				await qb1.relation('sku').of(orderItem).set(sku);
			} else {
				await qb1.relation('product').of(orderItem).set(product);
			}
			if (products[i].couponItemId) {
				const couponItem = await this.couponService.findCouponItemById(products[i].couponItemId);
				couponItem.isUsed = true;
				couponItem.usedDate = new Date();
				await this.couponService.updateCouponItem(couponItem);
				await qb1.relation('couponItem').of(orderItem).set(couponItem);
			}
			if (products[i].couponItemId) {
				const couponItem = await this.couponService.findCouponItemById(products[i].couponItemId);
				couponItem.isUsed = true;
				couponItem.usedDate = new Date();
				await this.couponService.updateCouponItem(couponItem);
			}
			orderItems.push(orderItem);
			await qb1.execute();
		}
		await qb.relation('items').of(order).add(orderItems);
		await qb.execute();
		return order.orderNo;
	}

	// 生成预览订单
	async previewOrder(userId: number, { products }: PreviewOrderDto) {
		await this.checkProductStock(products);
		const productIds = products.map((product) => product.id);
		const productWithCoupons: { [key: string]: CouponItem[] } = {};
		// 查询用户所有可用的优惠券
		const userCouponItems = await this.userService.findCouponItems(userId);
		console.log('[userCouponItems:] ', userCouponItems);
		// 找出所有的全场券
		const generalCouponItems = userCouponItems.filter((item) => item.coupon.scope === CouponScope.ALL);
		// 找出所有的商品券
		const productCouponItems = userCouponItems.filter((item) => item.coupon.scope === CouponScope.PRODUCT);
		// 找出所有的分类券
		const categoryCouponItems = userCouponItems.filter((item) => item.coupon.scope === CouponScope.CATEGORY);

		const setCoupon = (id: number, couponItem: CouponItem) => {
			if (!productWithCoupons[id]) {
				productWithCoupons[id] = [];
			}
			productWithCoupons[id].push(couponItem);
		};

		// 找出商品优惠券对应的商品
		for (let i = 0; i < productCouponItems.length; i++) {
			const coupon = await this.couponService.findOne(productCouponItems[i].coupon.id);
			const pIds = coupon.products.map((product) => product.id);
			productIds.forEach((id) => {
				if (pIds.includes(id)) {
					setCoupon(id, productCouponItems[i]);
				}
			});
		}

		// 找出商品所属分类
		for (let i = 0; i < productIds.length; i++) {
			const product = await this.productService.findOne(productIds[i]);
			// 商品分类
			const productCategory = product.productCategory;

			// 找出分类优惠券对应的分类
			for (let j = 0; j < categoryCouponItems.length; j++) {
				const coupon = await this.couponService.findOne(categoryCouponItems[j].coupon.id);
				const categories = coupon.categories;
				categories.forEach((category) => {
					if (category.id === productCategory.id) {
						setCoupon(product.id, categoryCouponItems[j]);
					} else if (category.parent && !productCategory.parent) {
						if (category.parent.id === productCategory.id) {
							setCoupon(product.id, categoryCouponItems[j]);
						}
					} else if (!category.parent && productCategory.parent) {
						if (category.id === productCategory.id) {
							setCoupon(product.id, categoryCouponItems[j]);
						}
					} else if (category.parent && productCategory.parent) {
						if (category.parent.id === productCategory.parent.id) {
							setCoupon(product.id, categoryCouponItems[j]);
						}
					}
				});
			}
		}

		const result = {
			products: [],
			totalPrice: 0,
			generalCoupon: null,
			generalCouponItem: null,
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
			const couponItems = productWithCoupons[products[i].id] || [];
			let maxDiscount = 0;
			let maxCoupon = null;
			let maxCouponItem = null;
			const totalPriceWithoutCoupon = salePrice * products[i].count;
			couponItems.forEach((couponItem) => {
				if (consumedCoupons.includes(couponItem.coupon.id)) {
					return;
				}
				if (couponItem.coupon.threshold <= totalPriceWithoutCoupon) {
					if (couponItem.coupon.value > maxDiscount) {
						maxDiscount = couponItem.coupon.value;
						maxCoupon = couponItem.coupon;
						maxCouponItem = couponItem;
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
				couponItem: { ...maxCouponItem, coupon: undefined },
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
		let maxCouponItem = null;
		generalCouponItems.forEach((couponItem) => {
			const coupon = couponItem.coupon;
			if (coupon.threshold <= totalPriceWithoutGeneralCoupon) {
				if (coupon.value > maxDiscount) {
					maxDiscount = coupon.value;
					maxCoupon = coupon;
					maxCouponItem = couponItem;
				}
			}
		});
		result.totalPrice = totalPriceWithoutGeneralCoupon - maxDiscount;
		result.generalCoupon = maxCoupon && {
			...maxCoupon,
			categories: undefined,
		};
		result.generalCouponItem = { ...maxCouponItem, coupon: undefined };

		return result;
	}

	async cancelOrder(order: Order) {
		if (!order) {
			throw new Error('Order not found');
		}
		if (order.status === OrderStatus.CLOSED) {
			throw new Error('订单已关闭');
		}
		if (order.status !== OrderStatus.UNPAID) {
			throw new Error('订单状态不正确');
		}
		// 将优惠券设置为未使用
		if (order.generalCouponItem) {
			order.generalCouponItem.isUsed = false;
			order.generalCouponItem.usedDate = null;
			await this.couponService.updateCouponItem(order.generalCouponItem);
		}
		const orderItems = order.items;
		for (let i = 0; i < orderItems.length; i++) {
			if (orderItems[i].couponItem) {
				orderItems[i].couponItem.isUsed = false;
				orderItems[i].couponItem.usedDate = null;
				await this.couponService.updateCouponItem(orderItems[i].couponItem);
			}
		}
		// 将库存加回去
		for (let i = 0; i < orderItems.length; i++) {
			const orderItem = orderItems[i];
			const product = await this.productService.findOne(orderItem.product.id);
			product.stock += orderItem.quantity;
			product.sales -= orderItem.quantity;
			await this.productRepository.save(product);
			if (orderItem.sku) {
				const sku = await this.productService.getSkuById(orderItem.sku.id);
				sku.stock += orderItem.quantity;
				await this.productService.saveSku(sku);
			}
		}
		order.status = OrderStatus.CLOSED;
		await this.orderRepository.save(order);
		return true;
	}

	/** 取消自己的订单 */
	async cancelSelfOrder(orderNo: string, userId: number) {
		const order = await this.orderRepository.findOne({
			where: { orderNo, user: { id: userId } },
			relations: { items: { product: true, sku: true } },
		});
		return this.cancelOrder(order);
	}

	/** 取消订单 */
	async adminCancelOrder(orderNo: string) {
		const order = await this.orderRepository.findOne({
			where: { orderNo },
			relations: { items: { product: true, sku: true } },
		});
		return this.cancelOrder(order);
	}

	/** 删除订单 */
	async deleteOrder(orderNo: string) {
		const order = await this.orderRepository.findOne({ where: { orderNo } });
		if (!order) {
			throw new Error('Order not found');
		}
		// 交易成功，交易关闭，退款成功的订单才能删除
		if (![OrderStatus.COMPLETED, OrderStatus.CLOSED, OrderStatus.REFUNDED].includes(order.status)) {
			throw new Error('订单状态不正确');
		}
		await this.orderRepository.softDelete(orderNo);
		return true;
	}
}
