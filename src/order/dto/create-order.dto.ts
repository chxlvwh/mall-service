import { Allow, IsNotEmpty } from 'class-validator';
import { Sku } from '../../product/entity/sku.entity';

export class CreateOrderDto {
	@IsNotEmpty({ message: '订单总金额不能为空' })
	totalPrice: number;

	@IsNotEmpty({ message: '订单项不能为空' })
	products: [
		{
			// 商品id
			id: number;
			// 商品数量
			count: number;
			// sku id
			sku: Sku;
			// 商品原价
			basePrice: number;
			// 优惠金额
			discount: number;
			// 优惠券
			couponId?: number;
		},
	];

	// 优惠券
	@Allow()
	generalCouponId?: number;

	// 收货地址
	@IsNotEmpty({ message: '收货地址不能为空' })
	receiverId: number;

	// 备注
	remark: string;
}
