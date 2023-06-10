import { Roles } from '../../roles/roles.entity';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
	@ApiProperty({ description: '用户名' })
	@IsString()
	@IsNotEmpty()
	username: string;

	@ApiProperty({ description: '密码' })
	@IsString()
	@IsNotEmpty()
	@Length(6, 32)
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
