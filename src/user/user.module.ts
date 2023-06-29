import { Global, Module } from '@nestjs/common';
import { UserAdminController } from './controllers/user.admin.controller';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from '../roles/roles.entity';
import { UserPublicController } from './controllers/user.public.controller';

@Global()
@Module({
	imports: [TypeOrmModule.forFeature([User, Roles])],
	controllers: [UserAdminController, UserPublicController],
	providers: [UserService],
	// 导出到global，其他module不需要再专门引用
	exports: [UserService],
})
export class UserModule {}
