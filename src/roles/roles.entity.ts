import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { Menus } from '../menus/menu.entity';

@Entity()
export class Roles {
	/**
	 * 角色id
	 * example: 1, 2, 3
	 * 1. 管理员
	 * 2. 测试用户
	 * 3. 普通用户
	 */
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@ManyToMany(() => User, (users) => users.roles)
	users: User[];

	@ManyToMany(() => Menus, (menus) => menus.role)
	menus: Menus[];
}
