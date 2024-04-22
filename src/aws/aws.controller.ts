import {
  Controller,
  Post,
  Delete,
  Param,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AwsService } from './aws.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('aws')
export class AwsController {
  constructor(private readonly awsService: AwsService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'video', maxCount: 1 },
      { name: 'image', maxCount: 2 },
    ]),
  )
  async upload(@UploadedFiles() files: Express.MulterS3.File[]) {
    const { video, image } = JSON.parse(JSON.stringify(files));

    const uploadFiles = {
      video,
      image,
    };

    return this.awsService.fileUpload(uploadFiles);
  }

  @Delete(':fileName')
  async delete(@Param('fileName') fileName: string) {
    return this.awsService.fileDelete(fileName);
  }
}
