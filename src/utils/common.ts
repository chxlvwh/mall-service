import { User } from '../user/user.entity';
import { Logs } from '../logs/logs.entity';
import { Roles } from '../roles/roles.entity';
import { Menus } from '../menus/menu.entity';
import { Allow, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { log } from 'winston';
import { CreateDateColumn, DeleteDateColumn, IsNull, Not, UpdateDateColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
	@ApiPropertyOptional({ description: '第几页' })
	@Allow()
	current: number;

	@ApiPropertyOptional({ description: '每页条数' })
	@IsOptional()
	pageSize?: number;

	@ApiPropertyOptional({ description: '排序字段' })
	@IsOptional()
	sortBy?: string;

	@ApiPropertyOptional({ description: '排序方式 ASC：正序，DESC：逆序' })
	@IsOptional()
	sortOrder?: 'ASC' | 'DESC';
}

export class DateProps {
	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'last_modified' })
	lastModifiedAt: Date;

	@DeleteDateColumn({ name: 'delete_at' })
	deletedAt: Date;
}

export const formatPageProps = (current, pageSize) => {
	const take = pageSize || 10;
	const skip = ((current || 1) - 1) * take;
	return { take, skip };
};

export const getEnumKeys = (enumObj: object) => {
	const arr = Object.values(enumObj) || [];
	return arr.slice(0, arr.length / 2);
};

export const getEnumValues = (enumObj: object) => {
	const arr = Object.keys(enumObj) || [];
	return arr.slice(0, arr.length / 2).map((it) => parseInt(it));
};

export const withDeleteQuery = (queryBuilder, isDeleted) => {
	if (!isDeleted) {
		queryBuilder = queryBuilder.withDeleted();
	} else if (isDeleted === '1') {
		queryBuilder = queryBuilder.withDeleted().where({ deletedAt: Not(IsNull()) });
	}
	return isDeleted;
};
