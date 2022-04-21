import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { FfmpegService } from './services/ffmpeg.service';
import { FilesService } from './services/files.service';
import { GenerateVideoDto } from './dto/add-video.dto';
import { CombineVideosDto } from './dto/combine-videos.dto';

@Controller('videos')
export class VideosController {
  constructor(
    private ffmpegService: FfmpegService,
    private filesService: FilesService,
  ) {}

  @Post('edit')
  // @UseInterceptors(FileInterceptor('video'))
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'video', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
      { name: 'logo', maxCount: 1 },
      { name: 'subtitles', maxCount: 1 },
    ]),
  )
  // addVideo(@Body() dto: GenerateVideoDto, @UploadedFile() video) {
  addVideo(
    @Body() dto: GenerateVideoDto,
    @UploadedFiles() files: { video?: any[], audio?: any[], logo?: any[], subtitles?: any[] },
  ) {
    // return this.filesService.createFile(video)
    const video = files.video?.[0];
    const audio = files.audio?.[0];
    const logo = files.logo?.[0];
    const subtitles = files.subtitles?.[0];

    return this.ffmpegService.generateVideo(dto, video, audio, logo, subtitles);
  }

  // @UseInterceptors(FileFieldsInterceptor([
  //   { name: 'avatar', maxCount: 1 },
  //   { name: 'background', maxCount: 1 },
  // ]))
  // uploadFile(@UploadedFiles() files: { avatar?: Express.Multer.File[], background?: Express.Multer.File[] }) {
  //   console.log(files);
  // }

  @Post('combine')
  combineVideos(@Body() dto: CombineVideosDto) {
    return this.ffmpegService.combineVideos(dto);
  }

  // @Get('test')
  // getByValue() {
  //   return this.ffmpegService.test()
  // }
}
