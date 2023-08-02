import { Body, Controller, Get, Header, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { PreviewOrderDto } from './dto/preview-order.dto';
import { OrderService } from './order.service';
import { JwtGuard } from '../guards/jwt.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { SearchOrderDto } from './dto/search-order.dto';

@UseGuards(JwtGuard)
@Controller('order')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@Get('')
	async findAll(@Query() searchOrderDto: SearchOrderDto) {
		return await this.orderService.findAll(searchOrderDto);
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
}
