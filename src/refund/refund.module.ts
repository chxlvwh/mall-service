import { Module } from '@nestjs/common';
import { RefundService } from './refund.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefundReason } from './entity/refund-reason.entity';
import { Refund } from './entity/refund.entity';
import { RefundReasonController } from './controller/refund-reason.controller';
import { RefundController } from './controller/refund.controller';

@Module({
	imports: [TypeOrmModule.forFeature([Refund, RefundReason])],
	providers: [RefundService],
	controllers: [RefundController, RefundReasonController],
	exports: [RefundService],
})
export class RefundModule {}
