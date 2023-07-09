import { Global, Module } from '@nestjs/common';
import { UserAdminController } from './controllers/user.admin.controller';
import { UserService } from './services/user.service';
import { User } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from '../roles/roles.entity';
import { UserPublicController } from './controllers/user.public.controller';
import { Receiver } from './entity/receiver.entity';
import { ReceiverService } from './services/receiver.service';

@Global()
@Module({
	imports: [TypeOrmModule.forFeature([User, Roles, Receiver])],
	controllers: [UserAdminController, UserPublicController],
	providers: [UserService, ReceiverService],
	// 导出到global，其他module不需要再专门引用
	exports: [UserService, ReceiverService],
})
export class UserModule {}
