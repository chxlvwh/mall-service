import { Controller, Get } from '@nestjs/common';
import { LogsService } from './logs.service';

@Controller('logs')
export class LogsController {
	constructor(private logsService: LogsService) {}

	@Get()
	getList(): any {
		return this.logsService.findAll();
	}
}
