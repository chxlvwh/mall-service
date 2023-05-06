import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfigEnum } from '../../enum/config.enum';

// 通过扩展PassportStrategy配置passport 策略
@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
	constructor(protected configService: ConfigService) {
		// 通过super来传送配置
		/**
		 * @param jwtFromRequest 提供从请求中提取 JWT 的方法。我们将使用在 API 请求的授权头中提供token的标准方法。这里描述了其他选项。
		 * @param ignoreExpiration 为了明确起见，我们选择默认的 false 设置，它将确保 JWT 没有过期的责任委托给 Passport 模块。这意味着，如果我们的路由提供了一个过期的 JWT ，请求将被拒绝，并发送 401 Unauthorized 的响应。Passport 会自动为我们办理。
		 * @param secretOrKey 使用权宜的选项来提供对称的秘密来签署令牌。
		 */
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get(AppConfigEnum.SECRET),
		});
	}

	async validate(payload: any) {
		// 这里的 payload 是在 authService 中生成 access_token 的时候假如的参数。
		return { userId: payload.sub, username: payload.username };
	}
}
