import {
  Controller,
  Body,
  Post,
  Delete,
  Param,
  UploadedFiles,
  UseInterceptors,
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
      { name: 'meta', maxCount: 5 },
    ]),
  )
  async upload(
    @UploadedFiles() files: Express.MulterS3.File[],
    @Body() body: any,
  ) {
    const { video, thumb, meta } = JSON.parse(JSON.stringify(files));

    const uploadFiles = {
      video,
      thumb,
      meta,
      ...body,
    };

    return this.ossService.fileUpload(uploadFiles);
  }

  @Delete(':fileName')
  async delete(@Param('fileName') fileName: string) {
    return this.ossService.fileDelete(fileName);
    // return this.ossService.deleteFolder(fileName);
  }
}
