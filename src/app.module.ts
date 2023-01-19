import { Module, Logger, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';
import * as dotenv from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { UserModule } from './user/user.module';
import { LogsModule } from './logs/logs.module';
import { RolesModule } from './roles/roles.module';
import { connectionParams } from '../ormconfig';

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
				DB_HOST: Joi.alternatives().try(
					Joi.string().ip(),
					Joi.string().domain(),
				),
				DB_PORT: Joi.number().default(3306),
				DB_SYNC: Joi.boolean().default(false),
				LOG_ON: Joi.boolean().default(false),
			}),
		}),
		TypeOrmModule.forRoot(connectionParams),
		UserModule,
		LogsModule,
		RolesModule,
	],
	providers: [Logger],
	exports: [Logger],
})
export class AppModule {}
