import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
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

	@Column({ unique: true })
	@Exclude()
	password: string;

	@OneToMany(() => Logs, (logs) => logs.user)
	logs: Logs[];

	@ManyToMany(() => Roles, (roles) => roles.users)
	@JoinTable({ name: 'users_roles' })
	roles: Roles[];

	@OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
	profile: Profile;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'last_modified' })
	lastModifiedAt: Date;

	@DeleteDateColumn({ name: 'delete_at' })
	deletedAt: Date;
}
