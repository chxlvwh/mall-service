import { Injectable } from '@nestjs/common';
import { RefundReason } from './entity/refund-reason.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Refund } from './entity/refund.entity';
import { Repository } from 'typeorm';
import { CreateReasonDto } from './dto/create-reason.dto';
import { UpdateReasonDto } from './dto/update-reason.dto';

@Injectable()
export class RefundService {
	constructor(
		@InjectRepository(Refund) private readonly refundRepository: Repository<Refund>,
		@InjectRepository(RefundReason) private readonly refundReasonRepository: Repository<RefundReason>,
	) {}

	/** 创建退款原因 */
	async createRefundReason(createReasonDto: CreateReasonDto) {
		return await this.refundReasonRepository.save(createReasonDto);
	}

	/** 获取退款原因列表 */
	async getRefundReasonList() {
		return await this.refundReasonRepository.find({ order: { sort: 'ASC' } });
	}

	/** 根据id获取退款原因 */
	async getRefundReasonById(id: number) {
		return await this.refundReasonRepository.findOne({ where: { id } });
	}

	/** 更新退款原因 */
	async updateRefundReason(id: number, updateReasonDto: UpdateReasonDto) {
		return await this.refundReasonRepository.update(id, updateReasonDto);
	}

	/** 删除退款原因 */
	async deleteRefundReason(id: number) {
		return await this.refundReasonRepository.delete(id);
	}
}
