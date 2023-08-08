import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../guards/admin.guard';
import { JwtGuard } from '../../guards/jwt.guard';
import { RefundService } from '../refund.service';
import { UpdateReasonDto } from '../dto/update-reason.dto';
import { CreateReasonDto } from '../dto/create-reason.dto';

@UseGuards(JwtGuard, AdminGuard)
@Controller('refund-reason')
export class RefundReasonController {
	constructor(private readonly refundService: RefundService) {}

	@Get(':id')
	async getRefundReason(@Param('id', ParseIntPipe) id: number) {
		return await this.refundService.getRefundReasonById(id);
	}

	@Get('')
	async getRefundReasonList() {
		return await this.refundService.getRefundReasonList();
	}

	@Post('')
	async createRefundReason(@Body() createReasonDto: CreateReasonDto) {
		return await this.refundService.createRefundReason(createReasonDto);
	}

	@Put(':id')
	async updateRefundReason(@Param('id', ParseIntPipe) id: number, @Body() updateReasonDto: UpdateReasonDto) {
		return await this.refundService.updateRefundReason(id, updateReasonDto);
	}

	@Delete(':id')
	async deleteRefundReason(@Param('id', ParseIntPipe) id: number) {
		return await this.refundService.deleteRefundReason(id);
	}
}
