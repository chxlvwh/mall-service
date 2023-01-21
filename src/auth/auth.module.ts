import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigEnum } from '../../enum/config.enum';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthStrategy } from './auth.strategy';

@Module({
	imports: [
		UserModule,
		PassportModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				return {
					secret: configService.get(AppConfigEnum.SECRET),
					signOptions: {
						expiresIn: '1d',
					},
				};
			},
		}),
	],
	providers: [AuthService, AuthStrategy],
	controllers: [AuthController],
})
export class AuthModule {}
