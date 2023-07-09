import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Receiver } from '../entity/receiver.entity';
import { Repository } from 'typeorm';
import { CreateReceiverDto } from '../dto/create-receiver.dto';
import { UpdateReceiverDto } from '../dto/update-receiver.dto';
import { UserService } from './user.service';

@Injectable()
export class ReceiverService {
	constructor(
		@InjectRepository(Receiver)
		private readonly receiverRepository: Repository<Receiver>,
		private readonly userService: UserService,
	) {}

	async createReceiver(userId: number, createReceiverDto: CreateReceiverDto) {
		const user = await this.userService.findOne(userId);
		if (createReceiverDto.isDefault) {
			const receivers = user.receivers;
			const defaultReceiver = receivers.find((receiver) => receiver.isDefault);
			if (defaultReceiver) {
				await this.receiverRepository.save({ ...defaultReceiver, isDefault: false });
			}
		}
		const receiver = this.receiverRepository.create(createReceiverDto);
		receiver.user = user;
		await this.receiverRepository.save(receiver);
		return await this.receiverRepository.findOne({
			where: { id: receiver.id },
		});
	}

	async updateReceiver(userId: number, receiverId: number, updateReceiverDto: UpdateReceiverDto) {
		const receiver = await this.receiverRepository.findOne({
			where: { id: receiverId },
		});
		if (!receiver) {
			throw new NotFoundException('收获地址不存在');
		}

		if (updateReceiverDto.isDefault) {
			const user = await this.userService.findOne(userId);
			const receivers = user.receivers;
			const defaultReceiver = receivers.find((receiver) => receiver.isDefault);
			if (defaultReceiver && defaultReceiver.id !== receiverId) {
				await this.receiverRepository.save({ ...defaultReceiver, isDefault: false });
			}
		}
		const newReceiver = this.receiverRepository.create(updateReceiverDto);
		newReceiver.user = receiver.user;
		await this.receiverRepository.save({ ...receiver, ...newReceiver });
		return await this.receiverRepository.findOne({
			where: { id: receiver.id },
		});
	}

	async deleteReceiver(userId: number, receiverId: number) {
		const receiver = await this.receiverRepository.findOne({
			where: { id: receiverId },
		});
		if (!receiver) {
			throw new NotFoundException('收获地址不存在');
		}
		await this.receiverRepository.remove(receiver);
		return;
	}

	async findAll(userId: number) {
		const user = await this.userService.findOne(userId);
		return user.receivers;
	}
}
