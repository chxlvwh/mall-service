export class GetUserDto {
	current: number;
	pageSize?: number;
	username?: string;
	role?: number;
	gender?: number;
	nickname?: string;
	email?: string;
	isDeleted?: string;
}
