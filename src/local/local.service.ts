import { BadRequestException, Injectable } from '@nestjs/common';
import { MulterConfigService } from './MulterConfigService';
import * as fs from 'fs';

@Injectable()
export class LocalService {
  constructor(private readonly multerConfigService: MulterConfigService) {}

  fileUpload(files: any) {
    if (!files) {
      throw new BadRequestException();
    }
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
