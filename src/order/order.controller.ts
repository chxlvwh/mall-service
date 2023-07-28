import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { PreviewOrderDto } from './dto/preview-order.dto';
import { OrderService } from './order.service';
import { JwtGuard } from '../guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('order')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@Post('preview')
	async previewOrder(@Body() previewOrderDto: PreviewOrderDto, @Req() request) {
		return this.orderService.previewOrder(Number(request.user.userId), previewOrderDto);
	}

	@Post('create')
	async createOrder(@Body() previewOrderDto: PreviewOrderDto, @Req() request) {

	}
}
