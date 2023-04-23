import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

/**
 * 在这里拦截器主要做数据脱敏处理
 *
 * 可以有以下功能：
 * 在方法执行之前/之后绑定额外的逻辑
 * 转换函数返回的结果
 * 转换函数抛出的异常
 * 扩展基本功能行为
 * 根据特定条件完全覆盖函数（例如，出于缓存目的）
 */
@Injectable()
export class SerializeInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		// 在请求处理之前
		const req = context.switchToHttp().getRequest();
		console.log('======[serialize.interceptor.ts：intercept：]======', req.body);
		return next.handle().pipe(
			// 在请求处理之后
			map((data) => {
				console.log('======[serialize.interceptor.ts：：]======', data);
				return data;
			}),
		);
	}
}
