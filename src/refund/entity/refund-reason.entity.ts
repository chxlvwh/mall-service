import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, Entity } from 'typeorm';

@Entity()
export class RefundReason {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	value: string;

	@Column({ default: true })
	isActive: boolean;

	@Column({ default: 0 })
	sort: number;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	lastModified: Date;

	@Column({ nullable: true })
	deletedAt?: Date;
}
