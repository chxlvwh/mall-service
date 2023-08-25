import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../guards/admin.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { SeckillService } from './seckill.service';
import { SearchSeckillDto } from './dto/search-seckill.dto';
import { CreateSeckillDto } from './dto/create-seckill.dto';
import { UpdateSeckillDto } from './dto/update-seckill.dto';
import { CreatePeriodDto } from './dto/create-period.dto';

@Controller('seckill')
@UseGuards(JwtGuard, AdminGuard)
export class SeckillController {
	constructor(private readonly seckillService: SeckillService) {}

	@Post(':id/period')
	async createPeriod(@Param('id', ParseIntPipe) id: number, @Body() body: CreatePeriodDto) {
		return await this.seckillService.createPeriod(id, body);
	}

	@Put(':id/period/:periodId')
	async updatePeriod(
		@Param('id', ParseIntPipe) id: number,
		@Param('periodId', ParseIntPipe) periodId: number,
		@Body() body: CreatePeriodDto,
	) {
		return await this.seckillService.updatePeriod(id, periodId, body);
	}

	@Delete(':id/period/:periodId')
	async deletePeriod(@Param('id', ParseIntPipe) id: number, @Param('periodId', ParseIntPipe) periodId: number) {
		return await this.seckillService.deletePeriod(id, periodId);
	}

	@Get()
	async findAll(@Query() query: SearchSeckillDto) {
		return await this.seckillService.findAll(query);
	}

	@Get(':id')
	async findById(@Param('id', ParseIntPipe) id: number) {
		return await this.seckillService.findById(id);
	}

	@Post()
	async create(@Body() body: CreateSeckillDto) {
		return await this.seckillService.create(body);
	}

	@Put(':id')
	async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateSeckillDto) {
		return await this.seckillService.update(id, body);
	}

	@Delete(':id')
	async delete(@Param('id', ParseIntPipe) id: number) {
		return await this.seckillService.remove(id);
	}

	@Put(':id/period/:periodId/periodProducts')
	async addPeriodProducts(
		@Param('id', ParseIntPipe) id: number,
		@Param('periodId', ParseIntPipe) periodId: number,
		@Body('productIds') productIds: number[],
	) {
		return await this.seckillService.addPeriodProducts(id, periodId, productIds);
	}

	@Get(':id/period/:periodId/periodProducts')
	async getPeriodProducts(@Param('id', ParseIntPipe) id: number, @Param('periodId', ParseIntPipe) periodId: number) {
		return await this.seckillService.getPeriodProducts(id, periodId);
	}

	@Delete(':id/period/:periodId/periodProduct/:periodProductId')
	async deletePeriodProduct(
		@Param('id', ParseIntPipe) id: number,
		@Param('periodId', ParseIntPipe) periodId: number,
		@Param('periodProductId', ParseIntPipe) periodProductId: number,
	) {
		return await this.seckillService.deletePeriodProduct(id, periodId, periodProductId);
	}
}
