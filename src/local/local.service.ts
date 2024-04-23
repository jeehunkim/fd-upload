import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterConfigService } from './MulterConfigService';
import { pickThumb } from 'src/util/pickThumb';
// import { createMixThumb } from 'src/util/imageWork';
import * as fs from 'fs';

@Injectable()
export class LocalService {
  constructor(
    private readonly multerConfigService: MulterConfigService,
    private readonly configService: ConfigService,
  ) {}

  async fileUpload(files: any) {
    if (!files) {
      throw new BadRequestException();
    }

    const videoLength = files.video.length;
    if (videoLength > 0) {
      const arrVideo = files.video;
      for await (const video of arrVideo) {
        const { filename, destination, path } = video;
        const pickName = filename.split('.')[0];
        const thumbName = `${pickName}${this.configService.get('THUMBNAIL_IMAGE_EXTENTION')}`;
        const makeThumb = await pickThumb(path, destination, thumbName);
        video.thumbInfo = makeThumb;
      }
    }

    // 한번에 올리는 비디오갯수가 1개 이상일경우
    // 해당 thumbnail의 가운데를 기준으로 잘라서 1개의 썸네일로 만들어준다.
    // if (videoLength > 1 && videoLength < 4) {
    //   const arrThumb = [];
    //   const arrVideo = files.video;
    //   for await (const video of arrVideo) {
    //     arrThumb.push(video.thumbInfo.thumbNail);
    //   }

    //   const imageWidth = parseInt(
    //     this.configService.get('THUMBNAIL_IMAGE_SIZE_WIDTH'),
    //   );
    //   const imageHeight = parseInt(
    //     this.configService.get('THUMBNAIL_IMAGE_SIZE_HEIGHT'),
    //   );

    //   const imgSize = {
    //     width: imageWidth, //1280,
    //     height: imageHeight, //720,
    //   };
    //   const mixThumb = await createMixThumb(
    //     arrThumb,
    //     imgSize,
    //     files.video[0].thumbInfo.duration,
    //   );
    //   files.video[0].thumbInfo.mixedThumbNail = mixThumb;
    // }

    return files;
  }

  fileDelete(fileName: string) {
    const fileDir = this.multerConfigService.dirPath;
    const fileFullPath = fileDir + '/' + fileName;

    try {
      fs.unlinkSync(fileFullPath);
      return 'deleted File';
    } catch (err) {
      throw new BadRequestException();
    }
  }
}
