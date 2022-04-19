import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class FilesService {
  async createFile(file, fileName?: string): Promise<string> {
    try {

      // const fileName = `${uuid.v4()}.jpg`


      const filePath = path.resolve(__dirname, '..', '..', 'static')

      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true })
      }

      fs.writeFileSync(path.join(filePath, fileName), file.buffer)

      return fileName
    } catch {
      throw new InternalServerErrorException()
    }
  }
}
