import { IsArray, IsNotEmpty } from 'class-validator';

export class CommentDto {
	@IsNotEmpty()
	@IsArray()
	products: { id: number; content: string }[];
}
