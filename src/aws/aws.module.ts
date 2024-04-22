import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterconfigService } from './MulterConfigService';
import { AwsController } from './aws.controller';
import { AwsService } from './aws.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: MulterconfigService,
      inject: [ConfigService],
    }),
  ],
  controllers: [AwsController],
  providers: [AwsService],
})
export class AwsModule {}
