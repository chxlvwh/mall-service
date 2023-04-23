import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from './roles.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Roles])],
	controllers: [RolesController],
	providers: [RolesService],
	exports: [RolesService],
})
export class RolesModule {}
