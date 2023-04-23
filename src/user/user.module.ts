import { Global, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from '../roles/roles.entity';

@Global()
@Module({
	imports: [TypeOrmModule.forFeature([User, Roles])],
	controllers: [UserController],
	providers: [UserService],
	// 导出到global，其他module不需要再专门引用
	exports: [UserService],
})
export class UserModule {}
