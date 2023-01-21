import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

// 拦截器主要做数据脱敏处理
@Injectable()
export class SerializeInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		// 在请求处理之前
		// const req = context.switchToHttp().getRequest();
		// console.log('======[serialize.interceptor.ts：intercept：]======', req);
		return next.handle().pipe(
			// 在请求处理之后
			map((data) => {
				console.log('======[serialize.interceptor.ts：：]======', data);
				return data;
			}),
		);
	}
}
