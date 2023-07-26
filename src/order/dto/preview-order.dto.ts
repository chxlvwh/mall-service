import { IsNotEmpty } from 'class-validator';

export class PreviewOrderDto {
	// 订单项
	@IsNotEmpty({ message: '订单项不能为空' })
	products: [
		{
			// 商品id
			id: number;
			// 商品数量
			count: number;
			// sku id
			skuId: number;
		},
	];
}
