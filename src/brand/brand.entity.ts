import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Brand {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column({ nullable: true })
	desc: string;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: string;

	@UpdateDateColumn({ name: 'last_modified_at' })
	lastModifiedAt: string;
}
