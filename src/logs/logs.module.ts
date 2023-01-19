import { Module } from '@nestjs/common';
import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logs } from './logs.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Logs])],
	controllers: [LogsController],
	providers: [LogsService],
})
export class LogsModule {}
