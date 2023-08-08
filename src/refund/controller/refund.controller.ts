import { Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../guards/admin.guard';
import { JwtGuard } from '../../guards/jwt.guard';
import { RefundService } from '../refund.service';
import { UpdateReasonDto } from '../dto/update-reason.dto';
import { CreateReasonDto } from '../dto/create-reason.dto';

@UseGuards(JwtGuard, AdminGuard)
@Controller('refund')
export class RefundController {
	constructor(private readonly refundService: RefundService) {}
}
