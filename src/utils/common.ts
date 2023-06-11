import { User } from '../user/user.entity';
import { Logs } from '../logs/logs.entity';
import { Roles } from '../roles/roles.entity';
import { Menus } from '../menus/menu.entity';
import { Allow, IsOptional } from 'class-validator';

export const getEntities = (path: string) => {
	const map = {
		'/api/v1/users': User,
		'/api/v1/logs': Logs,
		'/api/v1/roles': Roles,
		'/api/v1/menus': Menus,
		'/api/v1/auth': 'Auth',
	};

	for (let i = 0; i < Object.keys(map).length; i++) {
		const key = Object.keys(map)[i];
		if (path.startsWith(key)) {
			return map[key];
		}
	}
};

export class PaginationProps {
	@Allow()
	current: number;

	@IsOptional()
	pageSize?: number;
}

export const formatPageProps = (current, pageSize) => {
	const take = pageSize || 10;
	const skip = ((current || 1) - 1) * take;
	return { take, skip };
};
