import { Injectable } from "@nestjs/common";
import * as multer from "multer";
import * as path from "path";
import * as fs from "fs";
import { MulterOptionsFactory } from "@nestjs/platform-express";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
    dirPath: string;
    constructor() {
        this.dirPath = path.join(process.cwd(), "uploads");
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
                // console.log(req.body);

                done(null, dest);
            },
            filename(req, file, done) {
                const ext = path.extname(file.originalname);
                const name = path.basename(file.originalname, ext);
                done(null, `${name}${ext}`);
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
