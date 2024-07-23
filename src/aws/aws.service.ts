import { BadRequestException, Injectable } from '@nestjs/common';
// import { MulterconfigService } from './MulterConfigService.ts_';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsService {
  constructor(private readonly configService: ConfigService) {}

  fileUpload(files: any) {
    if (!files) {
      throw new BadRequestException();
    }
    return files;
  }

  // fileDelete(file: string) {
  //   const multerConfig = MulterconfigService(this.configService);
  //   const s3 = multerConfig.storage.s3;
  //   const Bucket = multerConfig.storage.bucket;
  //   const parmas = {
  //     Bucket,
  //     key: file,
  //   };

  //   try {
  //     s3.deleteObject(parmas, function (err: any, data: any) {
  //       if (err) {
  //         throw new BadRequestException();
  //       } else {
  //         return data;
  //       }
  //     });
  //   } catch (e) {
  //     throw new BadRequestException();
  //   }
  // }
}
