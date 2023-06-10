import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductAttribute } from './product-attribute.entity';

@Injectable()
export class ProductAttributeService {
	constructor(
		@InjectRepository(ProductAttribute)
		private readonly productAttributeRepository: Repository<ProductAttribute>,
	) {}
}
