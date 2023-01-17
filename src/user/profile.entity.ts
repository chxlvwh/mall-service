import {
	Column,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Profile {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	gender: string;

	@Column()
	photo: string;

	@Column()
	address: string;

	@OneToOne(() => User)
	@JoinColumn()
	user: User;
}
