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
				function createDailyTransports(
					level: string,
					filename: string,
				) {
					return new winston.transports.DailyRotateFile({
						level,
						filename: `${filename}-%DATE%.log`,
						...dailyRotateFileConfig,
					});
				}
				return {
					transports: [
						// 控制台日志
						consoleTransports,
						...(configService.get(LogConfigEnum.LOG_ON)
							? [
									createDailyTransports(
										configService.get(
											LogConfigEnum.LOG_LEVEL,
										)
											? configService
													.get(
														LogConfigEnum.LOG_LEVEL,
													)
													.toLowerCase()
											: 'info',
										'application',
									),
									createDailyTransports('warn', 'error'),
							  ]
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
