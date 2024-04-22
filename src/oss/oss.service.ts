import { BadRequestException, Injectable } from '@nestjs/common';
import { AliOssService } from './alioss';

@Injectable()
export class OssService {
  constructor(private readonly aliOssService: AliOssService) {}

  async uploadImageOSS(files: any, header: object) {
    if (!files) throw new BadRequestException();
    const uploadInfo = await this.aliOssService.uploadImage(files, header);
    return uploadInfo;
  }
}
