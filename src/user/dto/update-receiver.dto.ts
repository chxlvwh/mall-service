import { Allow, IsNotEmpty } from 'class-validator';

export class UpdateReceiverDto {
	@IsNotEmpty()
	name: string;

	@IsNotEmpty()
	phone: string;

	@IsNotEmpty()
	address: string;

	@Allow()
	province: string;

	@Allow()
	city: string;

	@Allow()
	region: string;

	@Allow()
	zip: string;

	@Allow()
	isDefault: boolean;
}
