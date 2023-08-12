import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { PreviewOrderDto } from './dto/preview-order.dto';
import { OrderService } from './order.service';
import { JwtGuard } from '../guards/jwt.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { SearchOrderDto } from './dto/search-order.dto';
import { AdminGuard } from '../guards/admin.guard';
import { UpdateOrderDto } from './dto/update-order.dto';
import { DeliveryDto } from '../order-setting/dto/delivery.dto';

@UseGuards(JwtGuard, AdminGuard)
@Controller('order')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@Get('')
	async findAll(@Query() searchOrderDto: SearchOrderDto) {
		return await this.orderService.findAll(searchOrderDto);
	}

	/** 快递列表 */
	@Get('logistic')
	async getLogisticList() {
		return await this.orderService.getLogisticList();
	}

	@Get(':orderNo')
	async findOne(@Param('orderNo', ParseIntPipe) orderNo: string) {
		return await this.orderService.findOne(orderNo);
	}

	@Post('preview')
	async previewOrder(@Body() previewOrderDto: PreviewOrderDto, @Req() request) {
		return await this.orderService.previewOrder(Number(request.user.userId), previewOrderDto);
	}

	@Post('')
	async createOrder(@Body() createOrderDto: CreateOrderDto, @Req() request) {
		const userAgent = request.headers['user-agent'];
		let orderSource = '';
		if (/ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/i.test(userAgent)) {
			//移动端
			orderSource = 'Mobile';
		} else {
			//pc端
			orderSource = 'PC';
		}
		return await this.orderService.createOrder(Number(request.user.userId), createOrderDto, orderSource);
	}

	/** 取消订单 */
	@Put(':orderNo/cancel')
	async cancelOrder(@Param('orderNo') orderNo: string) {
		return await this.orderService.adminCancelOrder(orderNo);
	}

	/** 更新订单 */
	@Put(':orderNo')
	async updateOrder(@Param('orderNo') orderNo: string, @Body() updateOrderDto: UpdateOrderDto) {
		return await this.orderService.updateOrder(orderNo, updateOrderDto);
	}

	/** 删除订单 */
	@Delete(':orderNo')
	async deleteOrder(@Param('orderNo') orderNo: string) {
		return await this.orderService.adminDeleteOrder(orderNo);
	}

	/** 发货 */
	@Put(':orderNo/deliver')
	async deliverOrder(@Param('orderNo') orderNo: string, @Body() DeliveryDto) {
		return await this.orderService.deliverOrder(orderNo, DeliveryDto);
	}

	/** updateDeliveryInfo */
	@Put(':orderNo/updateDeliveryInfo')
	async updateDeliveryInfo(@Param('orderNo') orderNo: string, @Body() DeliveryDto) {
		return await this.orderService.updateDeliveryInfo(orderNo, DeliveryDto);
	}
}
