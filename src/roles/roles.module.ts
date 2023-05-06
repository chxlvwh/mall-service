import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from './roles.entity';

@Module({
	// 引入其他模块
	imports: [TypeOrmModule.forFeature([Roles])],
	controllers: [RolesController],
	// 在本模块中用
	providers: [RolesService],
	// 给其他模块用
	exports: [RolesService],
})
export class RolesModule {}
