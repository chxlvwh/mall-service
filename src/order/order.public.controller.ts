import {
	Body,
	Controller,
	Delete,
	Get,
	Header,
	Param,
	ParseIntPipe,
	Post,
	Put,
	Query,
	Req,
	UseGuards,
} from '@nestjs/common';
import { PreviewOrderDto } from './dto/preview-order.dto';
import { OrderService } from './order.service';
import { JwtGuard } from '../guards/jwt.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { CommentDto } from './dto/comment.dto';

@UseGuards(JwtGuard)
@Controller('public/order')
export class PublicOrderController {
	constructor(private readonly orderService: OrderService) {}

	@Get('')
	async findAll(@Query() { status }: { status: string }, @Req() request) {
		return await this.orderService.findAllByUserId(Number(request.user.userId), status);
	}

	@Get(':orderNo')
	async findOne(@Param('orderNo', ParseIntPipe) orderNo: string, @Req() request) {
		return await this.orderService.findOrderByUserId(orderNo, Number(request.user.userId));
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
	async cancelOrder(@Param('orderNo') orderNo: string, @Req() request) {
		return await this.orderService.cancelSelfOrder(orderNo, Number(request.user.userId));
	}

	/** 删除订单 */
	@Delete(':orderNo')
	async deleteOrder(@Param('orderNo') orderNo: string, @Req() request) {
		return await this.orderService.deleteSelfOrder(orderNo, Number(request.user.userId));
	}

	/** 支付订单 */
	@Put(':orderNo/pay')
	async payOrder(@Param('orderNo') orderNo: string, @Body('payType', ParseIntPipe) payType: number, @Req() request) {
		return await this.orderService.payOrder(orderNo, Number(request.user.userId), payType);
	}

	/** 确认收货 */
	@Put(':orderNo/confirm')
	async confirmOrder(@Param('orderNo') orderNo: string, @Req() request) {
		return await this.orderService.confirmOrder(orderNo, Number(request.user.userId));
	}

	/** 评价订单 */
	@Put(':orderNo/comment')
	async commentOrder(@Param('orderNo') orderNo: string, @Req() request, @Body() commentDto: CommentDto) {
		return await this.orderService.commentOrder(orderNo, Number(request.user.userId), commentDto);
	}
}
