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
    private logoAddVideoExec;
    private videoAddAudioExec;
    private videoSubtitlesAddExec;
    private videoFiltersExec;
    generateVideo({ cropOffset, cropLimit, brightness, contrast, gamma, saturation }: GenerateVideoDto, video: any, audio: any, logo: any, subtitles: any): Promise<string>;
}
