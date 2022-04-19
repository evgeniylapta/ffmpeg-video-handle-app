import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FfmpegService } from './services/ffmpeg.service';
import { FilesService } from './services/files.service';
import { CreatePostDto } from './dto/add-video.dto';


@Controller('videos')
export class VideosController {
  constructor(private ffmpegService: FfmpegService, private filesService: FilesService) {
  }

  @Post('add')
  @UseInterceptors(FileInterceptor('video'))
  addVideo(@Body() { name }: CreatePostDto, @UploadedFile() video) {
    return this.filesService.createFile(video, name)
  }

  @Get('test')
  getByValue() {
    return this.ffmpegService.test()
  }
}
