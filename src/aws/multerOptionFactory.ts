import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as multerS3 from 'multer-s3';
import { basename, extname } from 'path';
import { Request } from 'express';

export const multerOptionsFactory = (
  configService: ConfigService,
): MulterOptions => {
  console.log(configService.get('AWS_REGION'));
  console.log(configService.get('AWS_S3_BUCKET_NAME'));
  return {
    storage: multerS3({
      s3: new S3Client({
        region: configService.get('AWS_REGION'),
      }),
      bucket: configService.get('AWS_S3_BUCKET_NAME'),
      contentType: multerS3.AUTO_CONTENT_TYPE,
      metadata(req, file, callback) {
        callback(null, { owner: 'it' });
      },
      key(req: Request, file, callback) {
        const userid = req.headers.userid;
        const type = file.fieldname;
        const date = new Date();
        const YYYYMMDD =
          date.getFullYear() +
          ('0' + (1 + date.getMonth())).slice(-2) +
          ('0' + date.getDate()).slice(-2);

        const fileName = file.originalname;
        const filePath = `${userid}/${YYYYMMDD}/${type}/${fileName}`;

        callback(null, filePath);
      },
    }),
    // 파일 크기 제한
    limits: {
      fileSize: 100 * 1024 * 1024,
    },
  };
};
