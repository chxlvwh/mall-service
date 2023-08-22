import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum OrderSettingKey {
	NormalOrderTimeout = 'normal_order_timeout',
	commentTimeout = 'comment_timeout',
}

export enum unitEnum {
	second = 'second',
	minute = 'minute',
	hour = 'hour',
	day = 'day',
}
@Entity()
export class OrderSetting {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'enum', enum: OrderSettingKey })
	key: OrderSettingKey;

	@Column()
	value: number;

	@Column({ type: 'enum', enum: unitEnum })
	unit: unitEnum;

	@Column()
	description: string;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'modified_at' })
	modifiedAt: Date;
}
