import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { MulterconfigService } from './MulterConfigService';
import { AwsController } from './aws.controller';
import { AwsService } from './aws.service';
// import { MulterBuilder } from './multerBuilder';
// import { CreateBodyAllMulterOptions } from './multerOptions';
import { multerOptionsFactory } from './multerOptionFactory';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: multerOptionsFactory,
      inject: [ConfigService],
    }),
  ],
  controllers: [AwsController],
  providers: [AwsService],
})
export class AwsModule {}
