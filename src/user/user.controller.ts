import { Controller, Get } from '@nestjs/common';

@Controller('user')
export class UserController {
	@Get('info')
	getInfo() {
		return 'Hello World!';
	}
}
