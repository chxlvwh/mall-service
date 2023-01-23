import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';

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
