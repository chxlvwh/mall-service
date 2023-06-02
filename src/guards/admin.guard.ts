import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

/**
 * Guard 唯一的功能是进行权限的验证
 *
 * 执行顺序：
 * Request => 中间件middleware => 守卫guard => 拦截器interceptor => 管道pipe
 * => 控制器controller => 服务service => 拦截器interceptor => 过滤器filter => Response
 */
@Injectable()
export class AdminGuard implements CanActivate {
	// 在使用AdminGuard 的时候要导入 UserModule，因为里面使用了 UserService
	constructor(private userService: UserService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest();
		// 这里的 user 是从 AuthStrategy 的 validate 方法中流转过来的
		if (req.user && (await this.cacheManager.get(`token-${req.user.userId}`))) {
			console.log('======[admin.guard.ts：line9：]======', req.user);
			const user = await this.userService.find(req.user.username);
			if (!user) {
				throw new BadRequestException('当前用户不存在');
			}
			// 管理员才能往下进行
			if (user.roles.find((r) => r.id === 1)) {
				return true;
			} else {
				await this.cacheManager.del(`token-${user.id}`);
			}
		}
		return false;
	}
}
