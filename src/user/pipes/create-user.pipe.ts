import { Injectable, PipeTransform } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class CreateUserPipe implements PipeTransform {
	transform(value: CreateUserDto) {
		if (value.roles && value.roles instanceof Array && value.roles.length) {
			if (value.roles[0]['id']) {
				value.roles = value.roles.map((role) => role.id);
			}
		}
		return value;
	}
}
