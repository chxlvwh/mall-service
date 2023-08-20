import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../product/entity/product.entity';
import { Seckill } from './seckill.entity';

@Entity()
export class SeckillPeriod {
	@PrimaryGeneratedColumn()
	id: number;

	/** 秒杀时间段名称 */
	@Column()
	name: string;

	/** 每日开始时间 */
	@Column({ name: 'start_time' })
	startTime: Date;

	/** 每日结束时间 */
	@Column({ name: 'end_time' })
	endTime: Date;

	/** 是否启用 */
	@Column({ default: true })
	enable: boolean;

	@ManyToMany(() => Product, (product) => product.seckillPeriod)
	@JoinTable({
		name: 'seckill_period_product',
		joinColumn: { name: 'product_id' },
		inverseJoinColumn: { name: 'seckill_period_id' },
	})
	products: Product[];

	@ManyToOne(() => Seckill, (seckill) => seckill.seckillPeriods)
	seckill: Seckill;
}
