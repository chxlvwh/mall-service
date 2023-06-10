import { Allow, IsOptional } from 'class-validator';
import { Roles } from '../../roles/roles.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
	@ApiProperty({ description: '用户名' })
	@Allow()
	username: string;

	@ApiProperty({ description: '密码' })
	@Allow()
	password: string;

	@ApiPropertyOptional({ description: '备注' })
	@IsOptional()
	remark?: string;

	@ApiPropertyOptional({ description: '性别，1-男，2-女' })
	@IsOptional()
	gender?: number;

	@ApiPropertyOptional({ description: '地址' })
	@IsOptional()
	address?: string;

	@ApiPropertyOptional({ description: '头像' })
	@IsOptional()
	avatar?: string;

	@ApiPropertyOptional({ description: '邮箱' })
	@IsOptional()
	email?: string;

	@ApiPropertyOptional({ description: '别名' })
	@IsOptional()
	nickname?: string;

	@ApiPropertyOptional({ description: '是否删除，1-是，2-否' })
	@IsOptional()
	isDeleted?: number;

	@ApiPropertyOptional({ description: '角色' })
	@IsOptional()
	roles?: Roles[] | number[];
}
