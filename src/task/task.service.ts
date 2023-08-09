import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TaskService {
	@Cron(CronExpression.EVERY_MINUTE)
	handleUnpaidOrderTimeout() {
		console.log('每分钟执行一次');
	}
}
