import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { LogsService } from './logs.service';
import { JwtGuard } from '../guards/jwt.guard';
import { AdminGuard } from '../guards/admin.guard';

@Controller('logs')
@UseGuards(JwtGuard, AdminGuard)
export class LogsController {
	constructor(
		private logsService: LogsService,
		protected readonly logger: Logger,
	) {
		this.logger = new Logger(LogsController.name);
	}

	@Get()
	async getList(): Promise<any> {
		const logs = await this.logsService.findAll();
		return logs.map((log) => ({
			...log,
			user: {
				...log.user,
				password: undefined,
			},
		}));
	}
}
