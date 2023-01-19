import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import logger from './log.config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { logger });
	app.setGlobalPrefix('api/v1');
	await app.listen(3000);
}
bootstrap();
