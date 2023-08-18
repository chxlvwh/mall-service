import { Module } from '@nestjs/common';
import { RecommendNewController } from './recommend-new.controller';
import { RecommandNewService } from './recommend-new.service';

@Module({
	controllers: [RecommendNewController],
	providers: [RecommandNewService],
})
export class RecommandNewModule {}
