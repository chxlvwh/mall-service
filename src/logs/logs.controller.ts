import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { LogsService } from './logs.service';
import { CaslGuard } from '../guards/casl.guard';
import { Can, CheckPolicies } from '../decorators/casl.decorator';
import { ActionEnum } from '../../enum/action.enum';
import { Logs } from './logs.entity';
import { JwtGuard } from '../guards/jwt.guard';
import { AdminGuard } from '../guards/admin.guard';

@Controller('logs')
@UseGuards(JwtGuard, AdminGuard, CaslGuard)
@CheckPolicies((ability) => ability.can(ActionEnum.Read, Logs))
@Can(ActionEnum.Read, Logs) // 通过meta配置访问该路径需要的实体的权限
export class LogsController {
	constructor(private logsService: LogsService, protected readonly logger: Logger) {
		this.logger = new Logger(LogsController.name);
	}

	@Get()
	// @Cannot(ActionEnum.Read, Logs)
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
