import { BadRequestException, Injectable } from '@nestjs/common';
import { OssConfigService } from './OssConfigService';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OssService {
  constructor(
    private readonly ossConfigService: OssConfigService,
    private readonly configService: ConfigService,
  ) {}

  fileUpload(files: any) {
    if (!files) {
      throw new BadRequestException();
    }
    return files;
  }

  fileDelete(filePath: string) {
    const ossClient = this.ossConfigService.ossClient;

    if (!filePath) {
      throw new BadRequestException();
    }

    try {
      const result = ossClient.delete(filePath);
      return result;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async makeFolder(name: string): Promise<void> {
    const ossClient = this.ossConfigService.ossClient;

    await ossClient.put(`${name}/`, Buffer.from(''));
    await ossClient.putACL(`${name}/`, 'public-read-write');
  }

  async setBucketACL(permission: any): Promise<void> {
    const ossClient = this.ossConfigService.ossClient;

    await ossClient.putBucketACL(
      this.configService.get('OSS_BUCKET_NAME'),
      // 'public-read-write',
      permission,
    );
  }

  async deleteFolder(name: string): Promise<void> {
    const ossClient = this.ossConfigService.ossClient;

    async function handleDel(name) {
      try {
        await ossClient.delete(name);
      } catch (error) {
        error.failObjectName = name;
        return error;
      }
    }

    async function deletePrefix(name: string | undefined) {
      const query = { prefix: name };
      const options = {};
      const list = await ossClient.list(query, options);

      list.objects = list.objects || [];
      await Promise.all(list.objects.map((v) => handleDel(v.name)));
    }
    deletePrefix(name);
  }
}
