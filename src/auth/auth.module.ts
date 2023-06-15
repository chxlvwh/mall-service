import { CacheModule, Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigEnum } from '../../enum/config.enum';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthStrategy } from './auth.strategy';
import { CaslAbilityService } from './casl-ability.service';

@Global()
@Module({
	imports: [
		PassportModule,
		JwtModule.registerAsync({
			imports: [ConfigModule, AuthModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				// 生成token的额外配置
				return {
					secret: configService.get(AppConfigEnum.SECRET),
					signOptions: {
						expiresIn: '7d',
					},
				};
			},
		}),
		// 加载缓存配置
		CacheModule.register(),
	],
	providers: [AuthService, AuthStrategy, CaslAbilityService],
	controllers: [AuthController],
	exports: [CaslAbilityService],
})
export class AuthModule {}
