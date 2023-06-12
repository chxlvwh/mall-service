import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import * as requestIp from 'request-ip';

/** Filter主要进行错误拦截 */
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
	private logger = new Logger();
	constructor(
		// private readonly logger: LoggerService,
		private readonly httpAdapterHost: HttpAdapterHost,
	) {}

	catch(exception: unknown, host: ArgumentsHost): any {
		const { httpAdapter } = this.httpAdapterHost;
		const ctx = host.switchToHttp();
		const request = ctx.getRequest();
		const response = ctx.getResponse();

		const httpStatus =
			exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

		const responseBody = {
			exception: exception['name'],
			error: exception['response'] || exception['message'] || 'Internal Server Error',
			timestamp: new Date().toISOString(),
		};

		const logContent = {
			exception: exception['name'],
			error: exception['response'] || exception['message'] || 'Internal Server Error',
			path: request.path,
			// headers: request.headers,
			query: request.query,
			body: request.body,
			params: request.params,
			timestamp: new Date().toISOString(),
			stack: exception['stack'],
			ip: requestIp.getClientIp(request),
		};

		const getErrorMessage = () => {
			if (logContent.error && logContent.error.message) {
				return logContent.error.message;
			}
			return logContent.error;
		};

		// 存到日志中
		this.logger.error(`[GlobalException] ${getErrorMessage()}`, logContent);
		// 接口的返回
		httpAdapter.reply(response, responseBody, httpStatus);
	}
}
