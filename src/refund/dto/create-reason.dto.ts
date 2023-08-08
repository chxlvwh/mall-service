import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateReasonDto {
	@IsNotEmpty({ message: '退款原因不能为空' })
	@IsString({ message: '退款原因必须是字符串' })
	@Length(1, 255, { message: '退款原因长度必须在1-255之间' })
	value: string;

	@IsOptional()
	isActive?: boolean;

	@IsOptional()
	sort?: number;
}
