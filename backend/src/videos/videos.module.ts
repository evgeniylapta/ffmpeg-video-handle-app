import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';
import { FfmpegService } from './services/ffmpeg.service';
import { FilesService } from './services/files.service';

@Module({
  providers: [FilesService, FfmpegService],
  controllers: [VideosController]
})
export class VideosModule {}
