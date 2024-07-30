import { BadRequestException, Injectable } from '@nestjs/common';
// import { MulterconfigService } from './MulterConfigService.ts_';
import { ConfigService } from '@nestjs/config';
import { pickThumb } from 'src/util/pickThumb';

@Injectable()
export class AwsService {
  constructor(private readonly configService: ConfigService) {}

  async fileUpload(files: any) {
    if (!files) {
      throw new BadRequestException();
    }
    const { video } = files;
    if (video.length > 0) {
      for await (const vdo of video) {
        const destination = this.configService.get('AWS_S3_BASE_PATH');
        const splitName = vdo.key.split('/');
        const fileName = splitName[splitName.length - 1];
        const pickName = fileName.split('.')[0];
        const thumbName = `${pickName}${this.configService.get('THUMBNAIL_IMAGE_EXTENTION')}`;
        const fileFullpath = `${destination}/${vdo.key}`;
        const subPath = vdo.key.replace(`/${fileName}`, '');
        const saveThumPath = destination + '/' + subPath;

        const makeThumb = await pickThumb(
          fileFullpath,
          saveThumPath,
          thumbName,
        );
        vdo.thumbInfo = makeThumb;
      }
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
