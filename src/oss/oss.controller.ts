import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Headers,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { OssService } from './oss.service';
import { AuthInterceptor } from 'src/util/auth.interceptor';

@Controller('oss')
export class OssController {
  constructor(private readonly ossService: OssService) {}

  @Post()
  @UseInterceptors(
    AuthInterceptor,
    FileFieldsInterceptor([
      { name: 'video', maxCount: 5 },
      { name: 'thumb', maxCount: 5 },
      { name: 'profile', maxCount: 2 },
      { name: 'json', maxCount: 5 },
    ]),
  )
  uploadImageOSS(@Headers() header?: object, @UploadedFiles() files?: any) {
    return this.ossService.uploadImageOSS(files, header);
  }
}
