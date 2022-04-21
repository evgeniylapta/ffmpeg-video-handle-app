import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';

@Injectable()
export class FilesService {
  async createFile(file): Promise<string> {
    try {
      const format = this.getFormatFromFile(file);

      const fileName = this.generateTempFileName(format);

      const filePath = path.resolve(__dirname, '..', '..', 'static');

      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }

      fs.writeFileSync(path.join(filePath, fileName), file.buffer);

      return fileName;
    } catch {
      throw new InternalServerErrorException();
    }
  }

  public getFormatFromFile(file: any) {
    return this.getFormatFromFileName(file.originalname);
  }

  public getFormatFromFileName(fileName: any) {
    const [, format] = fileName.split('.');
    return format;
  }

  public generateTempFileName(format: string) {
    return `${uuid.v4()}.${format}`;
  }
}
