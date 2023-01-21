import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

// 在这个类中可以进行权限的验证
@Injectable()
export class AdminGuard implements CanActivate {
	// 在使用AdminGuard 的时候要导入 UserModule，因为里面使用了 UserService
	constructor(private userService: UserService) {}
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest();
		if (req.user) {
			console.log(
				'======[admin.guard.ts：line9：]======',
				req.user.username,
			);
			const user = await this.userService.find(req.user.username);
			// 普通用户才能往下进行
			if (user.roles.find((r) => r.id === 3)) return true;
		}
		return false;
	}
}
