import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
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

	@Post('preview')
	async previewOrder(@Body() previewOrderDto: PreviewOrderDto, @Req() request) {
		return await this.orderService.previewOrder(Number(request.user.userId), previewOrderDto);
	}

	@Post('')
	async createOrder(@Body() createOrderDto: CreateOrderDto, @Req() request) {
		return await this.orderService.createOrder(Number(request.user.userId), createOrderDto);
	}
}
