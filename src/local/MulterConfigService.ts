import { Injectable } from '@nestjs/common';
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { MulterOptionsFactory } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  dirPath: string;
  constructor() {
    // this.dirPath = path.join(process.cwd(), 'uploads');
    this.dirPath = '/mnt/4Dist';
    this.mkdir();
  }

  mkdir() {
    try {
      fs.readdirSync(this.dirPath);
    } catch {
      fs.mkdirSync(this.dirPath);
    }
  }

  createMulterOptions(): MulterOptions | Promise<MulterOptions> {
    const dest = this.dirPath;

    const storage = multer.diskStorage({
      destination(req, file, done) {
        done(null, dest);
      },
      filename(req, file, done) {
        const userid = req.headers.userid;
        const type = file.fieldname;
        const date = new Date();
        const YYYYMMDD =
          date.getFullYear() +
          ('0' + (1 + date.getMonth())).slice(-2) +
          ('0' + date.getDate()).slice(-2);

        const fileName = file.originalname;

        const dirPath = `${dest}/${userid}/${YYYYMMDD}/${type}`;
        const isExists = fs.existsSync(dirPath);
        if (!isExists) {
          fs.mkdirSync(dirPath, { recursive: true });
        }

        const filePath = `${userid}/${YYYYMMDD}/${type}/${fileName}`;

        done(null, filePath);
      },
    });

    const limits = { fileSize: 1000 * 1024 * 1024 };

    return {
      dest,
      storage,
      limits,
    };
  }
}
