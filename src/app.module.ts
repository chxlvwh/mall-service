import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import * as process from 'process';
import * as dotenv from 'dotenv';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigEnum } from '../config/config.enum';
import * as Joi from 'joi';
import { User } from './user/user.entity';
import { Profile } from './user/profile.entity';
import { Logs } from './logs/logs.entity';
import { Roles } from './roles/roles.entity';

const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			// 下面两个配置中，如果有重复的变量，第一个优先
			envFilePath,
			load: [() => dotenv.config({ path: '.env' })],
			validationSchema: Joi.object({
				DB_TYPE: Joi.string().valid('mysql', 'postgres'),
			}),
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) =>
				({
					type: configService.get(ConfigEnum.DB_TYPE),
					host: configService.get(ConfigEnum.DB_HOST),
					port: configService.get(ConfigEnum.DB_PORT),
					username: configService.get(ConfigEnum.DB_USERNAME),
					password: configService.get(ConfigEnum.DB_PASSWORD),
					database: configService.get(ConfigEnum.DB_DATABASE),
					entities: [User, Profile, Logs, Roles],
					// 同步本地的schema与数据库 -> 初始化的时候去使用
					synchronize: configService.get(ConfigEnum.DB_SYNC),
					logging: ['error'],
				} as TypeOrmModuleOptions),
		}),
	],
	controllers: [UserController],
	providers: [UserService],
})
export class AppModule {}
