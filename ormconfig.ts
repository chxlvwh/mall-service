import { User } from './src/user/user.entity';
import { Profile } from './src/user/profile.entity';
import { Logs } from './src/logs/logs.entity';
import { Roles } from './src/roles/roles.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default {
	type: 'mysql',
	host: '127.0.0.1',
	port: 3308,
	username: 'root',
	password: '123456',
	database: 'dbtest',
	entities: [User, Profile, Logs, Roles],
	// 同步本地的schema与数据库 -> 初始化的时候去使用
	synchronize: true,
	logging: ['error'],
} as TypeOrmModuleOptions;
