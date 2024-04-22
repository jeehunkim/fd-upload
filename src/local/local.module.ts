import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalController } from './local.controller';
import { LocalService } from './local.service';
import { MulterConfigService } from './MulterConfigService';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useClass: MulterConfigService,
      inject: [ConfigService],
    }),
  ],
  controllers: [LocalController],
  providers: [LocalService, MulterConfigService],
})
export class LocalModule {}
