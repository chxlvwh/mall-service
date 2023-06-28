import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
	imports: [
		MulterModule.register({
			fileFilter: (req, file, callback) => {
				console.log('[upload.module.ts:] ', file);
				callback(null, true);
			},
		}),
	],
	controllers: [UploadController],
})
export class UploadModule {}
