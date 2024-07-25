import {
  Controller,
  Post,
  Delete,
  Param,
  UploadedFiles,
  UseInterceptors,
  Headers,
} from '@nestjs/common';
import { AwsService } from './aws.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AuthInterceptor } from 'src/util/auth.interceptor';
import { ConfigService } from '@nestjs/config';

@Controller('aws')
export class AwsController {
  constructor(
    private readonly awsService: AwsService,
    private configService: ConfigService,
  ) {}

  // FileFieldsInterceptor([
  //   { name: 'video', maxCount: 5 },
  //   { name: 'thumb', maxCount: 5 },
  //   { name: 'profile', maxCount: 2 },
  //   { name: 'json', maxCount: 5 },
  // ]),

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
  async upload(
    @Headers() header?: object,
    @UploadedFiles()
    files?: {
      video?: Express.MulterS3.File[];
      thumb?: Express.MulterS3.File[];
      profile?: Express.MulterS3.File[];
      json?: Express.MulterS3.File[];
    },
  ) {
    // const { video, thumb, profile, json } = JSON.parse(JSON.stringify(files));

    // const uploadFiles = {
    //   video,
    //   thumb,
    //   profile,
    //   json,
    // };

    return this.awsService.fileUpload(files);
  }

  // @Delete(':fileName')
  // async delete(@Param('fileName') fileName: string) {
  //   return this.awsService.fileDelete(fileName);
  // }
}
