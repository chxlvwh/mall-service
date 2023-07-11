import * as process from 'process';
import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import { Module, Logger, Global, ClassSerializerInterceptor, CacheModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { connectionParams } from '../ormconfig';
import { UserModule } from './user/user.module';
import { LogsModule } from './logs/logs.module';
import { RolesModule } from './roles/roles.module';
import { MenusModule } from './menus/menus.module';
import { AuthModule } from './auth/auth.module';
import { BrandModule } from './brand/brand.module';
import { ProductCategoryModule } from './product-category/product-category.module';
import { ProductController } from './product/product.controller';
import { ProductModule } from './product/product.module';
import { ProductAttributeModule } from './product-attribute/product-attribute.module';
import { UploadModule } from './upload/upload.module';
import { OrderModule } from './order/order.module';
import { PromotionModule } from './promotion/promotion.module';
import { SalesEventModule } from './sales-event/sales-event.module';
import { CouponModule } from './coupon/coupon.module';

const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;

@Global()
@Module({
	// 导入其他模块中导出的Providers，以实现共享
	controllers: [ProductController],
	// 模块中所有用到的功能类，模块内共享使用
	exports: [Logger, CacheModule],
	// 导出其他模块需要依赖的Providers
	imports: [
		// 设置配置文件地址和作用域已经加载方式
		ConfigModule.forRoot({
			isGlobal: true,
			// 下面两个配置中，如果有重复的变量，第一个优先
			envFilePath,
			load: [() => dotenv.config({ path: '.env' })],
			validationSchema: Joi.object({
				DB_TYPE: Joi.string().valid('mysql', 'postgres'),
				DB_HOST: Joi.alternatives().try(Joi.string().ip(), Joi.string().domain()),
				DB_PORT: Joi.number().default(3306),
				DB_SYNC: Joi.boolean().default(false),
				LOG_ON: Joi.boolean().default(false),
			}),
		}),
		// 添加静态文件路径
		// ServeStaticModule.forRoot({
		// 	rootPath: path.join(__dirname, '..', 'static'),
		// }),
		CacheModule.register(),
		// 加载数据库配置
		TypeOrmModule.forRoot(connectionParams),
		UserModule,
		LogsModule,
		RolesModule,
		AuthModule,
		MenusModule,
		BrandModule,
		ProductCategoryModule,
		ProductModule,
		ProductAttributeModule,
		UploadModule,
		OrderModule,
		PromotionModule,
		SalesEventModule,
		CouponModule,
	],
	/**
	 * 跟app.useGlobalInterceptors()的区别是，用provider的方式可以注入依赖
	 */
	providers: [
		Logger,
		// 全局拦截器，主要对数据脱敏和参数的序列化
		{
			provide: APP_INTERCEPTOR,
			useClass: ClassSerializerInterceptor,
		},
		// ProductService,
		// 全局使用 guard
		// {
		// 	provide: APP_GUARD,
		// 	useClass: AdminGuard,
		// },
	],
})
export class AppModule {}
