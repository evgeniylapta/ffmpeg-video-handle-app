import { FfmpegService } from './services/ffmpeg.service';
import { FilesService } from './services/files.service';
import { CreatePostDto } from './dto/add-video.dto';
export declare class VideosController {
    private ffmpegService;
    private filesService;
    constructor(ffmpegService: FfmpegService, filesService: FilesService);
    addVideo({ name }: CreatePostDto, video: any): Promise<string>;
    getByValue(): void;
}
