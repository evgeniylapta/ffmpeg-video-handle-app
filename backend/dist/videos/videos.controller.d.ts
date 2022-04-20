import { FfmpegService } from './services/ffmpeg.service';
import { FilesService } from './services/files.service';
import { GenerateVideoDto } from './dto/add-video.dto';
import { CombineVideosDto } from './dto/combine-videos.dto';
export declare class VideosController {
    private ffmpegService;
    private filesService;
    constructor(ffmpegService: FfmpegService, filesService: FilesService);
    addVideo(dto: GenerateVideoDto, files: {
        video?: any[];
        audio?: any[];
    }): Promise<string>;
    combineVideos(dto: CombineVideosDto): Promise<string>;
}
