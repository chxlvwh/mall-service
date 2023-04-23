import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	private logger = new Logger();
	catch(exception: HttpException, host: ArgumentsHost): any {
		const ctx = host.switchToHttp();
		const request = ctx.getRequest();
		const response = ctx.getResponse();
		const status = exception.getStatus();

		this.logger.error(exception.message, exception.stack);

		return response.status(status).json({
			statusCode: status,
			timestamp: new Date().toString(),
			path: request.url,
			method: request.method,
			message: exception.message || exception.name,
		});
	}
}
