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
		const req = context.switchToHttp().getRequest();
		console.log(
			'======[serialize.interceptor.ts：intercept：]======',
			req.params,
		);
		return next.handle().pipe(
			map((data) => {
				console.log('======[serialize.interceptor.ts：：]======', data);
				return data;
			}),
		);
	}
}
