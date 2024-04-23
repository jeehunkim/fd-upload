import * as sharp from 'sharp';
import * as path from 'path';
import joinImages from 'join-images';
import { createMeta } from './makeMeta';

export const createMixThumb = async (
  arrPath: string[],
  imgSize: any,
  duration: number,
): Promise<any> => {
  const fileLength = arrPath.length;
  const modLength = fileLength === 2 ? 4 : 3;
  const widthModLength = fileLength === 2 ? 2 : 1;
  const sliceImageLeft = Math.floor(imgSize.width / modLength);
  const sliceImageWidth = Math.floor(sliceImageLeft * widthModLength);

  const sliceImageHeight = imgSize.height;
  const arrCropImagePath = [];
  const mainImgSplitName = path.basename(arrPath[0]);
  //// const mainImgExtName = path.extname(arrPath[0]);

  const mainImgPath = arrPath[0].replace(mainImgSplitName, '');

  const outFileName =
    mainImgSplitName.split('_')[0] + '_mixed_' + mainImgSplitName.split('_')[2];

  const mainImgName = mainImgPath + outFileName;

  for await (const file of arrPath) {
    const originalImage = file;

    const targetPath = file.replace(
      originalImage.split('\\')[originalImage.split('\\').length - 1],
      '',
    );
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

  await joinImages(arrCropImagePath, {
    direction: 'horizontal',
  }).then((img) => {
    img.toFile(mainImgName);
  });

  const meta = { thumb: outFileName, duration };
  await createMeta(mainImgPath, JSON.stringify(meta));

  return mainImgName;
};
