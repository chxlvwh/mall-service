import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginUserDto {
	@IsString()
	@IsNotEmpty()
	@Length(6, 20, {
		// $value		当前传入的值
		// $property	当前属性名
		// $target		当前类
		// $constraint1	最小长度以此类推
		message: `用户名长度必须在$constraint1和$constraint2之间`,
	})
	username: string;

	@IsString()
	@IsNotEmpty()
	@Length(6, 32)
	password: string;
}
