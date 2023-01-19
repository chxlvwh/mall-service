import { Module, Logger, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as process from 'process';
import * as dotenv from 'dotenv';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DBConfigEnum } from '../enum/config.enum';
import * as Joi from 'joi';
import { User } from './user/user.entity';
import { Profile } from './user/profile.entity';
import { Logs } from './logs/logs.entity';
import { Roles } from './roles/roles.entity';
import { UserModule } from './user/user.module';
import { LogsModule } from './logs/logs.module';

const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;

@Global()
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
					type: configService.get(DBConfigEnum.DB_TYPE),
					host: configService.get(DBConfigEnum.DB_HOST),
					port: configService.get(DBConfigEnum.DB_PORT),
					username: configService.get(DBConfigEnum.DB_USERNAME),
					password: configService.get(DBConfigEnum.DB_PASSWORD),
					database: configService.get(DBConfigEnum.DB_DATABASE),
					entities: [User, Profile, Logs, Roles],
					// 同步本地的schema与数据库 -> 初始化的时候去使用
					synchronize: configService.get(DBConfigEnum.DB_SYNC),
					logging: ['error'],
				} as TypeOrmModuleOptions),
		}),
		UserModule,
		LogsModule,
	],
	providers: [Logger],
	exports: [Logger],
})
export class AppModule {}
