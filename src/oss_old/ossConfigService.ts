import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { MulterOptionsFactory } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as OSS from 'ali-oss';
import * as OSSStorage from 'multer-oss-new';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OssConfigService implements MulterOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  ossClient = new OSS({
    region: this.configService.get('OSS_REGION'),
    internal: false,
    accessKeyId: this.configService.get('OSS_ACCESS_KEY'),
    accessKeySecret: this.configService.get('OSS_SECRET_KEY'),
    bucket: this.configService.get('OSS_BUCKET_NAME'),
  });

  ossStorage = new OSSStorage({
    client: this.ossClient,
    // eslint-disable-next-line
    destination: async (req, file, ossClient) => {
      // const userid = req.headers?.userid;
      // const date = new Date();
      // const YYYYMMDD =
      //   date.getFullYear() +
      //   ('0' + (1 + date.getMonth())).slice(-2) +
      //   ('0' + date.getDate()).slice(-2);

      // let dest = `${YYYYMMDD}/${file.fieldname}/`;
      // if (userid) {
      //   dest = `${userid}/${dest}`;
      // }

      // return dest;

      return '';
    },
    // eslint-disable-next-line
    filename: async (req, file, ossClient) => {
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);
      const fileName = `${name}_${Date.now()}${ext}`;
      return fileName;
    },
    // eslint-disable-next-line
    options: async (req, file, ossClient) => {
      return {
        // contentLength: file.size,
        // headers: {
        //   Expires: 3600000,
        //   // 'x-oss-object-acl': 'public-read',
        // },
      };
    },
  });

  createMulterOptions(): MulterOptions | Promise<MulterOptions> {
    const storage = this.ossStorage;
    const limits = { fileSize: 100 * 1024 * 1024 };

    return {
      storage,
      limits,
    };
  }
}
