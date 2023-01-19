import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './filters/all-exception.filter';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as process from 'process';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
	app.setGlobalPrefix('api/v1');
	// 全局的 filter 只能有一个
	// app.useGlobalFilters(new HttpExceptionFilter());

	const httpAdapter = app.get(HttpAdapterHost);
	app.useGlobalFilters(new AllExceptionFilter(httpAdapter));
	await app.listen(process.env.APP_PORT);
}
bootstrap();
