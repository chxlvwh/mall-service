import { Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Repository } from 'typeorm';
import { Menus } from './menu.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MenusService {
	constructor(
		@InjectRepository(Menus)
		private readonly menusRepository: Repository<Menus>,
	) {}
	async create(createMenuDto: CreateMenuDto) {
		const menu = await this.menusRepository.create(createMenuDto);
		return this.menusRepository.save(menu);
	}

	findAll() {
		return this.menusRepository.find();
	}

	findOne(id: number) {
		return this.menusRepository.findOne({
			where: { id },
		});
	}

	async update(id: number, updateMenuDto: UpdateMenuDto) {
		const menu = await this.findOne(id);
		const newMenu = this.menusRepository.merge(menu, updateMenuDto);
		return this.menusRepository.save(newMenu);
	}

	remove(id: number) {
		return this.menusRepository.delete(id);
	}
}
