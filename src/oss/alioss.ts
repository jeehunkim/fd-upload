import { Injectable } from '@nestjs/common';
import * as OSS from 'ali-oss';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AliOssService {
  private readonly oss: OSS;

  constructor(private readonly configService: ConfigService) {
    this.oss = new OSS({
      region: this.configService.get('OSS_REGION'),
      internal: false,
      accessKeyId: this.configService.get('OSS_ACCESS_KEY'),
      accessKeySecret: this.configService.get('OSS_SECRET_KEY'),
      bucket: this.configService.get('OSS_BUCKET_NAME'),
    });
  }

  async uploadImage(files: any, header: object) {
    const { video, thumb } = files;
    const userid = header['userid'];

    const saveFile = async (type, data) => {
      const date = new Date();
      const YYYYMMDD =
        date.getFullYear() +
        ('0' + (1 + date.getMonth())).slice(-2) +
        ('0' + date.getDate()).slice(-2);

      const ext = path.extname(data.originalname);
      const name = path.basename(data.originalname, ext);
      const fileName = `${name}_${Date.now()}${ext}`;
      const filePath = `${userid}/${YYYYMMDD}/${type}/${fileName}`;

      return await this.oss.put(filePath, data.buffer);
    };

    try {
      const returnData = {
        video: [],
        thumb: [],
      };

      if (video) {
        for await (const videoSlice of video) {
          const saveVideo = await saveFile('video', videoSlice);
          if (saveVideo) returnData.video.push(saveVideo);
        }
      }

      if (thumb) {
        for await (const thumbSlice of thumb) {
          const saveThumb = await saveFile('thumb', thumbSlice);
          if (saveThumb) returnData.thumb.push(saveThumb);
        }
      }

      return returnData;
    } catch (e) {
      console.log(e);
    }
  }
}
