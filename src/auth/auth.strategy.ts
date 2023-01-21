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
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get(AppConfigEnum.SECRET),
		});
	}

	async validate(payload: any) {
		console.log('======[auth.strategy.ts：validate：]======', payload);
		return { userId: payload.sub, username: payload.username };
	}
}
