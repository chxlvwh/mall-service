import { utilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

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

export default WinstonModule.createLogger({
	transports: [
		// 控制台日志
		new winston.transports.Console({
			level: 'info',
			format: winston.format.combine(
				winston.format.timestamp(),
				utilities.format.nestLike(),
			),
		}),
		// 文件日志--warn 和 error
		new winston.transports.DailyRotateFile({
			level: 'warn',
			filename: 'warn-%DATE%.log',
			...dailyRotateFileConfig,
		}),
		// 文件日志--info（包括warn和error）
		new winston.transports.DailyRotateFile({
			level: 'info',
			filename: 'info-%DATE%.log',
			...dailyRotateFileConfig,
		}),
	],
});
