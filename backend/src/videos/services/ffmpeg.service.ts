import { Injectable, InternalServerErrorException } from '@nestjs/common';

const { spawn,  } = require('child_process');

const fs = require('fs');

import * as path from "path";
import { GenerateVideoDto } from '../dto/add-video.dto';
import { FilesService } from './files.service';
import { CombineVideosDto } from '../dto/combine-videos.dto';

@Injectable()
export class FfmpegService {
  constructor(private filesService: FilesService) {
  }

  private async execCommand(args: string[]) {
    const ls = spawn('ffmpeg', args);

    console.log(`ffmpeg process start`);
    console.log(`============================================`);

    return new Promise<void>((resolve, reject) => {
      ls.stdout.on('data', data => {
        console.log(`stdout: ${data}`);
      });

      ls.stderr.on('data', data => {
        console.log(`stderr: ${data}`);
      });

      ls.on('error', (error) => {
        reject(`error: ${error.message}`)
      });

      ls.on('close', code => {
        resolve()

        console.log(`ffmpeg process exited with code ${code}`);
        console.log(`============================================`);
      });
    })
  }

  private getFilePathByName(fileName: string) {
    return path.join(__dirname, '..', '..', 'static', fileName)
  }

  async combineVideos({ first, second, offset }: CombineVideosDto) {
    try {
      const firstFilePath = this.getFilePathByName(first);

      const secondFilePath = this.getFilePathByName(second);

      const videoFormat = await this.filesService.getFormatFromFileName(first)

      const resultFileName = this.filesService.generateTempFileName(videoFormat)
      // const resultFileName = this.filesService.generateTempFileName('mpg')
      const resultFilePath = this.getFilePathByName(resultFileName);

      console.log('resultFilePath');
      console.log(resultFilePath);

      await this.execCommand([
        '-i', firstFilePath,
        '-i', secondFilePath,
        '-filter_complex', '[0]settb=AVTB[v0];[1]settb=AVTB[v1]; [v0][v1]xfade=transition=hlslice:duration=1:offset=5,format=yuv420p',
        resultFilePath
      ])

      return resultFileName
    } catch (e) {
      throw new InternalServerErrorException()
    }
  }

  private async nextFileGenerationWrap(originalFileName: string, callback: (originalFilePath, newFilePath) => Promise<any>) {
    try {
      const format = await this.filesService.getFormatFromFileName(originalFileName)

      const originalFilePath = path.join(__dirname, '..', '..', 'static', originalFileName)

      const newFileName = this.filesService.generateTempFileName(format)

      const newFilePath = this.getFilePathByName(newFileName);

      await callback(originalFilePath, newFilePath)

      this.removeFile(originalFilePath)

      return newFileName
    } catch (e) {
      throw new InternalServerErrorException()
    }
  }

  private async videoCropExec(originalFileName: string, { cropLeft, cropRight }: Pick<GenerateVideoDto, "cropLeft" | "cropRight">) {
    // todo

    return await this.nextFileGenerationWrap(
      originalFileName,
      async (originalFilePath, newFilePath) => {
        await this.execCommand([
          '-ss', cropLeft || '0',
          '-i', originalFilePath,
          '-c', 'copy', '-t',  cropRight || '0',
          newFilePath
        ])
      }
    )
  }

  private removeFile(filePath) {
    fs.unlinkSync(filePath)
  }

  private async videoAddAudioExec(originalFileName: string, audioFile: any) {
    if (!audioFile) {
      return originalFileName
    }

    const audioFileName = await this.filesService.createFile(audioFile)
    const audioFilePath = await this.getFilePathByName(audioFileName)

    return await this.nextFileGenerationWrap(
      originalFileName,
      async (originalFilePath, newFilePath) => {
        await this.execCommand(['-i', audioFilePath, '-i', originalFilePath, '-shortest', newFilePath])

        this.removeFile(audioFilePath)
      }
    )
  }

  private async videoFiltersExec(
    originalFileName: string,
    props: Pick<GenerateVideoDto, "brightness" | "contrast" | "gamma" | "saturation">
  ) {

    if (Object.entries(props).every(item => !item)) {
      return originalFileName
    }

    const { brightness, contrast, saturation, gamma } = props

    return await this.nextFileGenerationWrap(
      originalFileName,
      async (originalFilePath, newFilePath) => {

        const brightnessString = brightness ? 'brightness=' + brightness : '';
        const contrastString = contrast ? 'contrast=' + contrast : '';
        const saturationString = saturation ? 'saturation=' + saturation : '';
        const gammaString = gamma ? 'gamma=' + gamma : '';

        const eqString = [brightnessString, contrastString, saturationString, gammaString]
          .filter(item => item)
          .join(':')

        await this.execCommand([
          '-i', originalFilePath,
          '-vf',
          `eq=${eqString}`,
          newFilePath
        ])
      }
    )
  }

  async generateVideo({ cropLeft, cropRight, brightness, contrast, gamma, saturation }: GenerateVideoDto, video: any, audio: any) {
    try {
      let videoName = await this.filesService.createFile(video)

      videoName = await this.videoAddAudioExec(videoName, audio)
      // todo change params
      // videoName = await this.videoCropExec(videoName, { cropLeft, cropRight })
      videoName = await this.videoFiltersExec(videoName, { brightness, contrast, gamma, saturation })

      return videoName
    } catch (e) {
      throw new InternalServerErrorException()
    }
  }
}

