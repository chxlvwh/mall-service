import { IsNotEmpty } from 'class-validator';

export class DeliveryDto {
	@IsNotEmpty()
	logisticNo: string;

	@IsNotEmpty()
	logisticCompanyId: number;
}
