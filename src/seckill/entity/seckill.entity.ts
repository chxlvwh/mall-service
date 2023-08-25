import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { SeckillPeriod } from './seckill-period.entity';

export enum SeckillStatus {
	NOT_STARTED,
	IN_PROGRESS,
	FINISHED,
}

@Entity()
export class Seckill {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	title: string;

	@Column({ type: 'enum', enum: SeckillStatus })
	status: number;

	@Column({ name: 'start_date' })
	startDate: Date;

	@Column({ name: 'end_date' })
	endDate: Date;

	/** 1: 上线，2： 下线 */
	@Column({ default: 0 })
	isOnline: number;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'last_modified_at' })
	lastModifiedAt: Date;

	@DeleteDateColumn({ name: 'deleted_at' })
	deletedAt: Date;

	@OneToMany(() => SeckillPeriod, (seckillPeriod) => seckillPeriod.seckill)
	seckillPeriods: SeckillPeriod[];
}
