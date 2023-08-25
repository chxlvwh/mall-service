import {
	Column,
	DeleteDateColumn,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../product/entity/product.entity';
import { Seckill } from './seckill.entity';
import { PeriodProduct } from './period-product.entity';

@Entity()
export class SeckillPeriod {
	@PrimaryGeneratedColumn()
	id: number;

	/** 秒杀时间段名称 */
	@Column()
	name: string;

	/** 每日开始时间 */
	@Column({ name: 'start_time' })
	startTime: string;

	/** 每日结束时间 */
	@Column({ name: 'end_time' })
	endTime: string;

	/** 是否启用 */
	@Column({ default: true })
	enable: boolean;

	@OneToMany(() => PeriodProduct, (periodProduct) => periodProduct.seckillPeriod)
	@JoinColumn({ name: 'period_product_id' })
	periodProducts: PeriodProduct[];

	@ManyToOne(() => Seckill, (seckill) => seckill.seckillPeriods)
	@JoinColumn()
	seckill: Seckill;

	@DeleteDateColumn()
	deletedAt: Date;
}
