import * as fs from 'fs';
import { readFile } from 'fs/promises';
import { promisify } from 'util';

export const createMeta = async (path: string, meta: string): Promise<void> => {
  const metaFile = `${path}/meta.json`;
  const checkExistsFile = await fs.existsSync(metaFile);
  const writeFile = promisify(fs.writeFile);

  let metaInfo;
  if (checkExistsFile) {
    const readMeta = await readFile(metaFile, 'utf8');
    metaInfo = await JSON.parse(readMeta);
    const metaData = await JSON.parse(meta);
    metaInfo.push(metaData);
  } else {
    metaInfo = [JSON.parse(meta)];
  }
  const stringData = JSON.stringify(metaInfo);
  return await writeFile(metaFile, stringData, 'utf8');
};

export const getMeta = async (path: string): Promise<any> => {
  const metaFile = `${path}/meta.json`;
  const checkExistsFile = await fs.existsSync(metaFile);

  if (checkExistsFile) {
    return await readFile(metaFile, 'utf8');
  }
  return false;
};

interface metaArrType {
  thumb: string;
  duration: number;
}

export const removeMeta = async (path: string, uuid: string): Promise<any> => {
  const metaFile = `${path}/meta.json`;
  const checkExistsFile = await fs.existsSync(metaFile);
  const writeFile = promisify(fs.writeFile);

  const checkIndex = async (arr: metaArrType[], uuid: string) => {
    const indexArr = [];
    arr.reduce((arr: any, ele: metaArrType, ind: number) => {
      const thumbUuid = ele.thumb.split('.')[0].split('_')[2];
      const thumbType = ele.thumb.split('.')[0].split('_')[1];
      if (thumbUuid === uuid && thumbType !== 'mixed') {
        indexArr.push(ind);
      }
    }, []);
    return indexArr;
  };

  if (checkExistsFile) {
    const readMeta = await readFile(metaFile, 'utf8');
    const metaInfo = await JSON.parse(readMeta);
    const fileIndexCheck = await checkIndex(metaInfo, uuid);

    const saveData = await metaInfo.filter(
      (ele, index) => !fileIndexCheck.includes(index),
    );

    const stringData = JSON.stringify(saveData);
    return await writeFile(metaFile, stringData, 'utf8');
  }
};
