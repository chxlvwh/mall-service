import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadDto } from './dto/upload-dto';
import { ConfigService } from '@nestjs/config';
import { UploadConfigEnum } from '../../enum/config.enum';
// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as qiniu from 'qiniu';
import { Readable } from 'stream';
import { extname } from 'path';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
	constructor(private readonly configService: ConfigService) {}
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		description: 'Upload file',
		type: UploadDto,
	})
	@Post()
	@UseInterceptors(FileInterceptor('file'))
	upload(@UploadedFile() uploadedFile: any, @Body() body: any) {
		const file = Readable.from([uploadedFile.buffer]);
		const config = new qiniu.conf.Config({
			zone: qiniu.zone.Zone_cn_east_2,
		});
		const formUploader = new qiniu.form_up.FormUploader(config);
		const putExtra = new qiniu.form_up.PutExtra();

		const mac = new qiniu.auth.digest.Mac(
			this.configService.get(UploadConfigEnum.QI_NIU_ACCESS_KEY),
			this.configService.get(UploadConfigEnum.QI_NIU_SECRET_KEY),
		);

		const options = {
			scope: this.configService.get(UploadConfigEnum.QI_NIU_BUCKET),
			returnBody: '{"size": $(fsize), "type": $(mimeType), "hash": $(etag), "name": $(fname)}',
		};
		const putPolicy = new qiniu.rs.PutPolicy(options);
		const uploadToken = putPolicy.uploadToken(mac);
		// 存储文件名
		const key = Date.now() + extname(uploadedFile.originalname);
		return new Promise((resolve, reject) => {
			formUploader.putStream(uploadToken, key, file, putExtra, (respErr, respBody, respInfo) => {
				if (respErr) {
					reject(respErr);
				}
				if (respInfo.statusCode === 200) {
					resolve({
						...respBody,
						url: this.configService.get(UploadConfigEnum.QI_NIU_DOWNLOAD_URL) + '/' + respBody.name,
					});
				} else {
					resolve({
						...respBody,
						url: this.configService.get(UploadConfigEnum.QI_NIU_DOWNLOAD_URL) + '/' + respBody.name,
					});
				}
			});
		});
	}
}
