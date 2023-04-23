import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './filters/all-exception.filter';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as process from 'process';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
	app.setGlobalPrefix('api/v1');
	// 全局的 filter 只能有一个
	// app.useGlobalFilters(new HttpExceptionFilter());

	const httpAdapter = app.get(HttpAdapterHost);
	// 全局过滤器，主要做异常处理
	app.useGlobalFilters(new AllExceptionFilter(httpAdapter));
	// 全局管道，主要用来做数据的验证和类型转换
	app.useGlobalPipes(
		new ValidationPipe({
			// 去除在类上不存做的字段
			whitelist: true,
			forbidUnknownValues: false,
		}),
	);
	await app.listen(process.env.APP_PORT);
}
bootstrap();
