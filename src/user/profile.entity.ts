import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { IsOptional } from 'class-validator';

@Entity()
export class Profile {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: true })
	@IsOptional()
	gender: number;

	@Column({ name: 'nick_name', nullable: true })
	@IsOptional()
	nickName: string;

	@Column({ nullable: true })
	@IsOptional()
	email: string;

	@Column({ nullable: true })
	@IsOptional()
	avatar: string;

	@Column({ nullable: true })
	@IsOptional()
	address: string;

	@OneToOne(() => User, (user) => user.profile)
	@JoinColumn()
	user: User;
}
