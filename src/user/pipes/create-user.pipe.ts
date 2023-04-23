import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';

/**
 * 这是一个管道
 *
 * @desc 转换：将输入数据转换为所需的形式（例如，从字符串到整数）
 * 验证：评估输入数据，如果有效，则简单地通过它；否则抛出异常
 */
@Injectable()
export class CreateUserPipe implements PipeTransform {
	transform(value: CreateUserDto) {
		if (value.roles && value.roles instanceof Array && value.roles.length) {
			value.roles.forEach((r, index) => {
				if (
					typeof r !== 'number' &&
					(!Number(r) || r instanceof Array)
				) {
					throw new BadRequestException(
						'each element in roles must be numeric',
					);
				}
				if (r['id']) {
					value.roles[index] = r['id'];
				}
			});
		}
		return value;
	}
}
