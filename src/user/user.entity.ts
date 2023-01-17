import {
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Logs } from '../logs/logs.entity';
import { Roles } from '../roles/roles.entity';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	username: string;

	@Column()
	password: string;

	@OneToMany(() => Logs, (logs) => logs.user)
	logs: Logs[];

	@ManyToMany(() => Roles, (roles) => roles.users)
	@JoinTable({ name: 'users_roles' })
	roles: Roles;
}
