import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesEnum } from '../../enum/roles.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserService } from '../user/user.service';

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(private reflector: Reflector, private userService: UserService) {}
	async canActivate(context: ExecutionContext): Promise<boolean> {
		// getAllAndOverride -> 读取metadata的优先级 路由>Controller
		// getAllAndMerge -> 合并
		const requiredRoles = this.reflector.getAllAndOverride<RolesEnum[]>(
			ROLES_KEY,

			[context.getHandler(), context.getClass()],
		);
		console.log('requiredRoles', requiredRoles);
		if (!requiredRoles) {
			return true;
		}
		const req = context.switchToHttp().getRequest();
		const user = await this.userService.find(req.user.username);
		const roleIds = user.roles.map((it) => it.id);
		return requiredRoles.some((role) => roleIds.includes(role));
	}
}
