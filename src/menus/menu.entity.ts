import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Roles } from '../roles/roles.entity';

@Entity()
export class Menus {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	path: string;

	@Column()
	order: number;

	@Column()
	acl: string;

	/**
	 * 一个role对应多个menu
	 */
	@ManyToMany(() => Roles, (roles) => roles.menus)
	@JoinTable({ name: 'role_menus' })
	role: Roles;
}
