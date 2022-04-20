import { GenerateVideoDto } from '../dto/add-video.dto';
import { FilesService } from './files.service';
import { CombineVideosDto } from '../dto/combine-videos.dto';
export declare class FfmpegService {
    private filesService;
    constructor(filesService: FilesService);
    private execCommand;
    private getFilePathByName;
    combineVideos({ first, second, offset }: CombineVideosDto): Promise<string>;
    private nextFileGenerationWrap;
    private videoCropExec;
    private removeFile;
    private videoAddAudioExec;
    private videoFiltersExec;
    generateVideo({ cropLeft, cropRight, brightness, contrast, gamma, saturation }: GenerateVideoDto, video: any, audio: any): Promise<string>;
}
