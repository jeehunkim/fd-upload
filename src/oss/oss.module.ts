import { Module } from '@nestjs/common';
import { OssController } from './oss.controller';
import { OssService } from './oss.service';
import { AliOssService } from './alioss';

@Module({
  controllers: [OssController],
  providers: [OssService, AliOssService],
})
export class OssModule {}
