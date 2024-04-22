import { BadRequestException, Injectable } from '@nestjs/common';
import { OssConfigService } from './ossConfigService';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as fs from 'fs';

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

  getSignature(file: any) {
    const ossClient = this.ossConfigService.ossClient;
    // const url = ossClient.signatureUrl(file.file);

    const filename = 'test.png';
    const response = {
      'content-disposition': `attachment; filename=${encodeURIComponent(
        filename,
      )}`,
    };
    const url = ossClient.signatureUrl(file.file, { response });

    // const filename = 'C:\\Users\\4DREPLAY\\Pictures\\Gangwon VW\\test4.txt';

    // axios
    //   .get(url, { responseType: 'arraybuffer' })
    //   .then((response) => {
    //     fs.writeFile(filename, response.data, 'utf8', (err) => {
    //       if (err) {
    //         console.log(err);
    //       } else {
    //         console.log('downloaded');
    //       }
    //     });

    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    console.log(file.file);
    return url;
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

  async existsObject(filePath: string): Promise<boolean> {
    const ossClient = this.ossConfigService.ossClient;

    try {
      const result = await ossClient.get(filePath);
      if (result?.res?.status === 200) {
        return true;
      } else {
      }
    } catch (e) {
      return false;
    }
    return false;
  }
}
