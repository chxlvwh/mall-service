import { IsNotEmpty } from 'class-validator';

export class UpdateSettingDto {
	@IsNotEmpty()
	value: number;
}
