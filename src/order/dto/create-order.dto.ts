import { Allow, IsNotEmpty } from 'class-validator';
import { Sku } from '../../product/entity/sku.entity';

export class CreateOrderDto {
	@IsNotEmpty({ message: '订单总金额不能为空' })
	totalPrice: number;

	@IsNotEmpty({ message: '订单项不能为空' })
	products: [
		{
			/**商品id */
			id: number;
			/**商品数量 */
			count: number;
			/**商品sku */
			sku: Sku;
			/**商品skuId */
			basePrice: number;
			/**当前商品总价	 */
			totalPrice: number;
			/**当前商品优惠后总价 */
			discountedTotalPrice: number;
			/**当前商品优惠金额 */
			discount: number;
			/**当前商品优惠券 */
			couponId?: number;
			/**当前商品优惠券项 */
			couponItemId?: number;
		},
	];

	// 优惠券
	@Allow()
	generalCouponId?: number;

	// 优惠券项
	@Allow()
	generalCouponItemId?: number;

	// 收货地址
	@IsNotEmpty({ message: '收货地址不能为空' })
	receiverId: number;

	// 备注
	remark: string;
}
