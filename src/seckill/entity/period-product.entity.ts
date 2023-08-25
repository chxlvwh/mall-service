import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../product/entity/product.entity';
import { SeckillPeriod } from './seckill-period.entity';

@Entity()
export class PeriodProduct {
	@PrimaryGeneratedColumn()
	id: number;

	/** 秒杀数量 */
	@Column({ default: 0 })
	count: number;

	/** 秒杀价格 */
	@Column()
	price: number;

	/** 限购数量
	 * 默认0： 不限购 */
	@Column({ default: 0 })
	limited: number;

	/** 剩余数量 默认0 */
	@Column({ default: 0 })
	remaining: number;

	@Column({ default: 0 })
	sort: number;

	@ManyToOne(() => Product, (product) => product.periodProduct)
	@JoinColumn({ name: 'product_id' })
	product: Product;

	@ManyToOne(() => SeckillPeriod, (seckillPeriod) => seckillPeriod.periodProducts)
	seckillPeriod: SeckillPeriod;
}
