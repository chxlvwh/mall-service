import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { IsNotEmpty, IsOptional } from 'class-validator';

@Entity()
export class Profile {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	@IsOptional()
	gender: number;

	@Column({ name: 'nick_name' })
	@IsOptional()
	nickName: number;

	@Column()
	@IsOptional()
	email: string;

	@Column()
	@IsOptional()
	avatar: string;

	@Column()
	@IsOptional()
	address: string;

	@OneToOne(() => User, (user) => user.profile)
	@JoinColumn()
	user: User;
}
