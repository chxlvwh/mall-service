import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './filters/all-exception.filter';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as process from 'process';
import { ValidationPipe } from '@nestjs/common';
import { SerializeInterceptor } from './interceptors/serialize.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
	// app.enableCors();
	app.setGlobalPrefix('api/v1');
	// 全局的 filter 只能有一个
	// app.useGlobalFilters(new HttpExceptionFilter());
	app.useGlobalInterceptors(new SerializeInterceptor());

	const httpAdapter = app.get(HttpAdapterHost);
	// 全局过滤器，主要做异常处理
	app.useGlobalFilters(new AllExceptionFilter(httpAdapter));
	// 全局管道，主要用来做数据的验证和类型转换
	app.useGlobalPipes(
		new ValidationPipe({
			// 去除在类上不存在的字段
			/**
			 * If set to true validator will strip validated object of any properties that do not have any decorators.
			 * Tip: if no other decorator is suitable for your property use @Allow decorator.
			 */
			whitelist: true,
			forbidUnknownValues: false,
		}),
	);

	// 配置swagger文档
	const config = new DocumentBuilder()
		.setTitle('Mall service')
		.setDescription('The mall API description')
		.setVersion('1.0')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('/api/doc', app, document, {
		customCssUrl: '/css/theme-flattop.css',
	});
	await app.listen(process.env.APP_PORT);
	console.info(`Server is running on port ${process.env.APP_PORT}`);
}
bootstrap();
