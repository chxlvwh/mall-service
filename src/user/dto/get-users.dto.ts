import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetUserDto {
	@ApiPropertyOptional({ description: '第几页' })
	current: number;
	@ApiPropertyOptional({ description: '每页条数' })
	pageSize?: number;
	@ApiPropertyOptional({ description: '用户名' })
	username?: string;
	@ApiPropertyOptional({ description: '角色' })
	role?: number;
	@ApiPropertyOptional({ description: '性别，1-男，2-女', type: 'enum', enum: [1, 2], default: 1 })
	gender?: number;
	@ApiPropertyOptional({ description: '别名' })
	nickname?: string;
	@ApiPropertyOptional({ description: '邮箱' })
	email?: string;
	@ApiPropertyOptional({ description: '是否删除，1-删除，0-未删除, null', type: 'enum', enum: [0, 1] })
	isDeleted?: string;
}
