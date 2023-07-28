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

@Injectable()
export class OrderService {
	constructor(
		@InjectRepository(Order) private readonly orderRepository: Repository<Order>,
		@InjectRepository(OrderItem) private readonly orderItemRepository: Repository<OrderItem>,
		private readonly couponService: CouponService,
		private readonly userService: UserService,
		private readonly productService: ProductService,
	) {}

	async createOrder(userId: number, createOrderDto: CreateOrderDto) {
		const { products, receiverId, remark, generalCouponId } = createOrderDto;
		const order = this.orderRepository.create();
		order.id = format(new Date(), 'yyyyMMddHHmmssSSS');
		order.remark = remark;
		order.status = OrderStatus.UNPAID;
		const user = await this.userService.findOne(userId);
		const receiver = await this.userService.findReceiverById(receiverId);
		const generalCoupon = await this.couponService.findOne(generalCouponId);
		await this.orderRepository.save(order);
		const qb = this.orderRepository.createQueryBuilder('order');
		await qb.relation('user').of(order).add(user);
		await qb.relation('receiver').of(order).add(receiver);
		await qb.relation('generalCoupon').of(order).add(generalCoupon);
		const orderItems = [];
		for (let i = 0; i < products.length; i++) {
			const orderItem = this.orderItemRepository.create();
			orderItem.quantity = products[i].count;
			orderItem.discountedPrice = products[i].basePrice - products[i].discount;
			orderItem.status = OrderItemStatus.NOT_DELIVERED;
			await this.orderItemRepository.save(orderItem);
			const qb = this.orderItemRepository.createQueryBuilder('orderItem');
			await qb.relation('items').of(order).add(orderItems);
			const product = await this.productService.findOne(products[i].id);
			const coupon = await this.couponService.findOne(products[i].couponId);
			await qb.relation('product').of(orderItem).add(product);
			if (products[i].sku) {
				const sku = await this.productService.getSkuById(products[i].sku.id);
				await qb.relation('sku').of(orderItem).add(sku);
			}
			await qb.relation('coupon').of(orderItem).add(coupon);
			orderItems.push(orderItem);
		}
		await qb.execute();
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
			const basePrice = salePrice * products[i].count;
			coupons.forEach((coupon) => {
				if (consumedCoupons.includes(coupon.id)) {
					return;
				}
				if (coupon.threshold <= basePrice) {
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
				basePrice,
				cover: product.coverUrls && product.coverUrls[0],
			});
		}

		const totalPriceWithoutGeneralCoupon = result.products.reduce((acc, cur, idx) => {
			return acc + cur.basePrice * products[idx].count - cur.discount;
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
