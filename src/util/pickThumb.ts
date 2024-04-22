import * as ffmpeg from 'fluent-ffmpeg';
ffmpeg.setFfmpegPath('C:/ffmpeg/bin/ffmpeg.exe');
ffmpeg.setFfprobePath('C:/ffmpeg/bin/ffprobe.exe');
// import { createFile } from './makeFile';
import { createMeta } from './makeMeta';
import { ConfigService } from '@nestjs/config';

export const pickThumb = async (fileData, filePath, fileName) => {
  const configService = new ConfigService();

  return new Promise((resolve, reject) => {
    const returnObj = {
      duration: 0,
      thumbNail: '',
      shotSeconds: '',
    };

    ffmpeg.ffprobe(fileData, function (err, metadata) {
      const duration = metadata?.format?.duration;
      returnObj.duration = duration;

      const floorDuration = Math.floor(duration / 2);
      const date = new Date(0);
      date.setSeconds(floorDuration);
      const timeString = date.toISOString().substring(14, 23);
      returnObj.shotSeconds = timeString;

      if (fileName.split('_')[0] !== 'assists') {
        const meta = { thumb: fileName, duration: returnObj.duration };
        createMeta(filePath, JSON.stringify(meta));
      }
    });

    const imageWidth = configService.get('THUMBNAIL_IMAGE_SIZE_WIDTH');
    const imageHeight = configService.get('THUMBNAIL_IMAGE_SIZE_HEIGHT');
    const imgSize = imageWidth + 'x' + imageHeight;

    ffmpeg(fileData)
      // .seek('00:01.000')
      .screenshot({
        timestamps: [returnObj.shotSeconds],
        count: 1,
        folder: filePath,
        filename: fileName,
        size: imgSize,
        // size: '50%',
      })
      .on('end', () => {
        const imageFile = filePath + '\\' + fileName;
        returnObj.thumbNail = imageFile;
        resolve(returnObj);
      })
      .on('error', reject);

    //const htmlFileName = fileName.split('.')[0] + '.html';
    //createFile(filePath, htmlFileName);
  });
};
