import {
  Controller,
  Post,
  Delete,
  Param,
  UploadedFiles,
  UseInterceptors,
  HttpCode,
  Body,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { LocalService } from './local.service';

@Controller('local')
export class LocalController {
  constructor(private readonly localService: LocalService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'video', maxCount: 5 },
      { name: 'thumb', maxCount: 5 },
      { name: 'profile', maxCount: 2 },
      { name: 'json', maxCount: 5 },
    ]),
  )
  async upload(
    @UploadedFiles() files: Express.MulterS3.File[],
    @Body() body: any,
  ) {
    const { video, thumb, profile, json } = JSON.parse(JSON.stringify(files));
    const uploadFiles = {
      video,
      thumb,
      profile,
      json,
      ...body,
    };

    return this.localService.fileUpload(uploadFiles);
  }

  @Delete(':fileName')
  @HttpCode(200)
  async delete(@Param('fileName') fileName: string) {
    return this.localService.fileDelete(fileName);
  }
}
