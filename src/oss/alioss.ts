import { Injectable } from '@nestjs/common';
import * as OSS from 'ali-oss';
// import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { pickThumb } from 'src/util/pickThumb';
import { createMixThumb } from 'src/util/imageWork';

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
    const { video, thumb, profile, json } = files;
    const userid = header['userid'];

    const saveFile = async (type: string, data: any) => {
      const date = new Date();
      const YYYYMMDD =
        date.getFullYear() +
        ('0' + (1 + date.getMonth())).slice(-2) +
        ('0' + date.getDate()).slice(-2);

      // const ext = path.extname(data.originalname);
      // const name = path.basename(data.originalname, ext);
      // const fileName = `${name}_${Date.now()}${ext}`;

      // let filePath;
      // if (userid.toLowerCase() === 'mwc') {
      //   filePath = `${userid}/${YYYYMMDD}/${fileName}`;
      // } else {
      //   filePath =
      //     type === 'profile'
      //       ? `${userid}/${fileName}`
      //       : `${userid}/${YYYYMMDD}/${type}/${fileName}`;
      // }

      const fileName = data.originalname;
      const filePath = `${userid}/${YYYYMMDD}/${type}/${fileName}`;

      return await this.oss.put(filePath, data.buffer);
    };

    try {
      const returnData = {
        video: [],
        thumb: [],
        profile: [],
        json: [],
      };

      if (video) {
        for await (const videoSlice of video) {
          const saveVideo = await saveFile('video', videoSlice);
          if (saveVideo) returnData.video.push(saveVideo);
        }

        const videoLength = returnData.video.length;
        if (videoLength > 0) {
          const arrVideo = returnData.video;
          for await (const video of arrVideo) {
            const { name } = video;
            // const destination = `/tmp/ossfs`;
            const destination = this.configService.get('OSS_BASE_PATH');
            const splitName = name.split('/');
            const fileName = splitName[splitName.length - 1];
            const pickName = fileName.split('.')[0];
            const thumbName = `${pickName}${this.configService.get('THUMBNAIL_IMAGE_EXTENTION')}`;
            const fileFullpath = `${destination}/${name}`;
            const subPath = name.replace(`/${fileName}`, '');
            const saveThumPath = destination + '/' + subPath;

            const makeThumb = await pickThumb(
              fileFullpath,
              saveThumPath,
              thumbName,
            );
            video.thumbInfo = makeThumb;
          }
        }

        // 한번에 올리는 비디오갯수가 1개 이상일경우
        // 해당 thumbnail의 가운데를 기준으로 잘라서 1개의 썸네일로 만들어준다.
        if (videoLength > 1 && videoLength < 4) {
          const arrThumb = [];
          const arrVideo = returnData.video;
          for await (const video of arrVideo) {
            arrThumb.push(video.thumbInfo.thumbNail);
          }

          const imageWidth = parseInt(
            this.configService.get('THUMBNAIL_IMAGE_SIZE_WIDTH'),
          );
          const imageHeight = parseInt(
            this.configService.get('THUMBNAIL_IMAGE_SIZE_HEIGHT'),
          );
          const imgSize = {
            width: imageWidth, //1280,
            height: imageHeight, //720,
          };

          const mixThumb = await createMixThumb(
            arrThumb,
            imgSize,
            returnData.video[0]?.thumbInfo?.duration,
          );
          returnData.video[0].thumbInfo.mixedThumbNail = mixThumb;
        }
      }

      if (thumb) {
        for await (const thumbSlice of thumb) {
          const saveThumb = await saveFile('thumb', thumbSlice);
          if (saveThumb) returnData.thumb.push(saveThumb);
        }
      }

      if (profile) {
        for await (const profileSlice of profile) {
          const saveProfile = await saveFile('profile', profileSlice);
          if (saveProfile) returnData.profile.push(saveProfile);
        }
      }

      if (json) {
        for await (const jsonSlice of json) {
          const saveJson = await saveFile('json', jsonSlice);
          if (saveJson) returnData.json.push(saveJson);
        }
      }

      return returnData;
    } catch (e) {
      console.log(e);
    }
  }
}
