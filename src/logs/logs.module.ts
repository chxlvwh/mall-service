import { Module } from '@nestjs/common';
import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logs } from './logs.entity';
import { utilities, WinstonModule } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { LogConfigEnum } from '../../enum/config.enum';

const dailyRotateFileConfig = {
	dirname: 'logs',
	datePattern: 'YYYY-MM-DD-HH',
	zippedArchive: true,
	maxSize: '20m',
	maxFiles: '14d',
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.simple(),
	),
};

@Module({
	imports: [
		WinstonModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				const consoleTransports = new winston.transports.Console({
					level: 'info',
					format: winston.format.combine(
						winston.format.timestamp(),
						utilities.format.nestLike(),
					),
				});

				const dailyTransports = new winston.transports.DailyRotateFile({
					level: 'warn',
					filename: 'warn-%DATE%.log',
					...dailyRotateFileConfig,
				});

				const dailyInfoTransports =
					new winston.transports.DailyRotateFile({
						filename: 'info-%DATE%.log',
						...dailyRotateFileConfig,
						level: configService.get(
							configService.get(LogConfigEnum.LOG_LEVEL),
						),
					});
				return {
					transports: [
						// 控制台日志
						consoleTransports,
						...(configService.get(LogConfigEnum.LOG_ON)
							? [dailyTransports, dailyInfoTransports]
							: []),
					],
				};
			},
		}),
		TypeOrmModule.forFeature([Logs]),
	],
	controllers: [LogsController],
	providers: [LogsService],
})
export class LogsModule {}
