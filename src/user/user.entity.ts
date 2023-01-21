import {
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Logs } from '../logs/logs.entity';
import { Roles } from '../roles/roles.entity';
import { Profile } from './profile.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	username: string;

	@Column()
	@Exclude()
	password: string;

	@OneToMany(() => Logs, (logs) => logs.user)
	logs: Logs[];

	@ManyToMany(() => Roles, (roles) => roles.users)
	@JoinTable({ name: 'users_roles' })
	roles: Roles[];

	@OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
	profile: Profile;
}
