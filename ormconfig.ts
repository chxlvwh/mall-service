import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { DBConfigEnum } from './enum/config.enum';
import * as process from 'process';

// 通过环境变量读取不同的.env文件
function getEnv(envPath: string) {
	if (fs.existsSync(envPath)) {
		return dotenv.parse(fs.readFileSync(envPath));
	}
	return {};
}
// 通过dotENV来解析不同的配置
function buildConnectionOptions() {
	const defaultConfig = getEnv('.env');
	const envConfig = getEnv(`.env.${process.env.NODE_ENV || 'development'}`);
	const config = { ...defaultConfig, ...envConfig };

	const entitiesDir =
		process.env.NODE_ENV === 'test' ? [__dirname + '/**/*.entity.ts'] : [__dirname + '/**/*.entity{.js,.ts}'];

	return {
		type: config[DBConfigEnum.DB_TYPE],
		host: config[DBConfigEnum.DB_HOST],
		port: Number(config[DBConfigEnum.DB_PORT]),
		username: config[DBConfigEnum.DB_USERNAME],
		password: config[DBConfigEnum.DB_PASSWORD],
		database: config[DBConfigEnum.DB_DATABASE],
		entities: entitiesDir,
		// 同步本地的schema与数据库 -> 初始化的时候去使用
		// 如果是 true，那么在连接数据库时，typeorm 会自动根据 entity 目录来修改数据表
		synchronize: config[DBConfigEnum.DB_SYNC] && config[DBConfigEnum.DB_SYNC].toUpperCase() === 'TRUE',
		// 是否在控制台打印数据库访问日志
		// logging: process.env.NODE_ENV === 'development',
		logging: ['error'],
	} as TypeOrmModuleOptions;
}

export const connectionParams = buildConnectionOptions();

export default new DataSource({
	...connectionParams,
	migrations: ['src/migrations/**'],
	subscribers: [],
} as DataSourceOptions);
