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
