import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { Menus } from '../menus/menu.entity';

@Entity()
export class Roles {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@ManyToMany(() => User, (users) => users.roles)
	users: User[];

	@ManyToMany(() => Menus, (menus) => menus.role)
	menus: Menus[];
}
