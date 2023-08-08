import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity()
export class Refund {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	orderNo: string;

	@Column()
	amount: number;

	@Column()
	reason: string;
}
