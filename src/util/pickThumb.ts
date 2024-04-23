import * as ffmpeg from 'fluent-ffmpeg';
ffmpeg.setFfmpegPath('C:/ffmpeg/bin/ffmpeg.exe');
ffmpeg.setFfprobePath('C:/ffmpeg/bin/ffprobe.exe');
// import { createFile } from './makeFile';
import { createMeta, getMeta, removeMeta } from './makeMeta';
import { ConfigService } from '@nestjs/config';
import * as sharp from 'sharp';
import * as path from 'path';
import joinImages from 'join-images';
interface metaArrType {
  thumb: string;
  duration: number;
}

export const pickThumb = async (fileData, filePath, fileName) => {
  const configService = new ConfigService();

  const imageWidth = parseInt(configService.get('THUMBNAIL_IMAGE_SIZE_WIDTH'));
  const imageHeight = parseInt(
    configService.get('THUMBNAIL_IMAGE_SIZE_HEIGHT'),
  );

  const metaWrite = async (path: string, thumb: string, duration: number) => {
    const meta = { thumb, duration };
    await createMeta(path, JSON.stringify(meta));
  };

  // const metaDelete = async (path: string, uuid: string) => {
  //   await removeMeta(path, uuid);
  // };

  const checkSumCropImage = async (uuid: string, target: string) => {
    const checkMetaFile = await getMeta(target);
    const metaArray = JSON.parse(checkMetaFile);

    const checkIndex = async (arr: metaArrType[], uuid: string) => {
      const indexArr = [];
      arr.reduce((arr: any, ele: metaArrType, ind: number) => {
        const thumbUuid = ele.thumb.split('.')[0].split('_')[2];
        if (thumbUuid === uuid) {
          indexArr.push(ind);
        }
      }, []);
      return indexArr;
    };

    const checkExistsThumb = async (arr: metaArrType[], checkName: string) => {
      return await arr
        .map((item) => item.thumb.indexOf(checkName))
        .find((name) => name >= 0);
    };

    if (metaArray) {
      const fileIndexCheck = await checkIndex(metaArray, uuid);
      const fileCntCheck = fileIndexCheck.length;
      const cropThumbName = `assists_mixed_${uuid}.jpg`;
      const existsThumbCheck = await checkExistsThumb(metaArray, cropThumbName);

      if (fileCntCheck === 3 && existsThumbCheck === undefined) {
        const targetData = [];
        for await (const index of fileIndexCheck) {
          targetData.push(metaArray[index].thumb);
        }
        return targetData;
      }
    }
    return false;
  };

  const makeCopImgAndCropSum = async (imgPath: string, imgArr: string[]) => {
    const fileLength = imgArr.length;
    const modLength = fileLength === 2 ? 4 : 3;
    const widthModLength = fileLength === 2 ? 2 : 1;
    const sliceImageLeft = Math.floor(imageWidth / modLength);
    const sliceImageWidth = Math.floor(sliceImageLeft * widthModLength);
    const sliceImageHeight = imageHeight;
    const arrCropImagePath = [];
    const mainImgSplitName = path.basename(imgArr[0]);
    const outFileName =
      mainImgSplitName.split('_')[0] +
      '_mixed_' +
      mainImgSplitName.split('_')[2];
    const mainImgName = imgPath + '\\' + outFileName;

    for await (const file of imgArr) {
      const targetPath = imgPath + '\\';
      const originalImage = targetPath + file;
      const ext = path.extname(file);
      const name = path.basename(file, ext);
      const outputImage = `${targetPath}${name}_crop${ext}`;

      await sharp(originalImage)
        .extract({
          left: sliceImageLeft,
          top: 0,
          width: sliceImageWidth,
          height: sliceImageHeight,
        })
        .toFile(outputImage);
      arrCropImagePath.push(outputImage);
    }
    return await joinImages(arrCropImagePath, {
      direction: 'horizontal',
    }).then((img) => {
      img.toFile(mainImgName);
      return img;
    });
  };

  return new Promise((resolve, reject) => {
    const returnObj = {
      duration: 0,
      thumbNail: '',
      shotSeconds: '',
    };

    ffmpeg.ffprobe(fileData, function (err, metadata) {
      const duration = metadata?.format?.duration;
      const transDuration = !isNaN(duration) ? Number(duration) * 1000 : 0;
      returnObj.duration = transDuration;

      const floorDuration = Math.floor(duration / 2);
      const date = new Date(0);
      date.setSeconds(floorDuration);

      const timeString = date.toISOString().substring(14, 23);
      returnObj.shotSeconds = timeString;

      metaWrite(filePath, fileName, returnObj.duration);
    });

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
      .on('end', async () => {
        const imageFile = filePath + '\\' + fileName;
        returnObj.thumbNail = imageFile;

        if (fileName.split('_')[0] === 'assists') {
          const uuid = fileName.split('.')[0].split('_')[2];
          const checkImgProcess = await checkSumCropImage(uuid, filePath);

          if (checkImgProcess) {
            const makeImgFile = await makeCopImgAndCropSum(
              filePath,
              checkImgProcess,
            );
            const savedFileName = `assists_mixed_${uuid}.jpg`;
            if (makeImgFile) {
              await metaWrite(filePath, savedFileName, returnObj.duration);
              // await metaDelete(filePath, uuid);
            }
          }
        }

        resolve(returnObj);
      })
      .on('error', reject);

    //const htmlFileName = fileName.split('.')[0] + '.html';
    //createFile(filePath, htmlFileName);
  });
};
