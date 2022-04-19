import { Injectable, InternalServerErrorException } from '@nestjs/common';

const { spawn } = require('child_process');

const fs = require('fs');

import * as path from "path";

const filePath = path.join(__dirname, '..', '..', 'static', 'sample_960x400_ocean_with_audio.flv');
const resultFile = path.join(__dirname, '..', '..', 'static', 'sample.mp4');

@Injectable()
export class FfmpegService {
  private async convertVideo() {
    const ls = spawn('ffmpeg', ['-i', filePath,  resultFile]);

    ls.stdout.on('data', data => {
      console.log(`stdout: ${data}`);
    });

    ls.stderr.on('data', data => {
      console.log(`stderr: ${data}`);
    });

    ls.on('error', (error) => {
      console.log(`error: ${error.message}`);
    });

    ls.on('close', code => {
      console.log(`child process exited with code ${code}`);
    });
  }


  test() {
    try {
      const isFileExists = fs.existsSync(resultFile)

      if (isFileExists) {
        fs.unlinkSync(resultFile)
      }

      this.convertVideo()
    } catch (e) {
      throw new InternalServerErrorException()
    }
  }
}

