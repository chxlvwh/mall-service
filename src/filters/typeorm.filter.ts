import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpStatus,
	Logger,
} from '@nestjs/common';
import { QueryFailedError, TypeORMError } from 'typeorm';

@Catch(TypeORMError)
export class TypeormFilter implements ExceptionFilter {
	private logger = new Logger();
	catch(exception: TypeORMError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const request = ctx.getRequest();
		const response = ctx.getResponse();

		this.logger.error(exception.message, exception.stack);

		let code = 500;
		if (exception instanceof QueryFailedError) {
			code = exception.driverError.errno;
		}

		return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
			code,
			timestamp: new Date().toString(),
			path: request.url,
			method: request.method,
			message: exception.message,
		});
	}
}
