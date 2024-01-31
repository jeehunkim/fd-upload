import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OssController } from './oss.controller';
import { OssService } from './oss.service';
import { OssConfigService } from './ossConfigService';

@Module({
  imports: [
    ConfigModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useClass: OssConfigService,
      inject: [ConfigService],
    }),
  ],
  controllers: [OssController],
  providers: [OssService, OssConfigService],
})
export class OssModule {}
