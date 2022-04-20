"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FfmpegService = void 0;
const common_1 = require("@nestjs/common");
const { spawn, } = require('child_process');
const fs = require('fs');
const path = require("path");
const files_service_1 = require("./files.service");
let FfmpegService = class FfmpegService {
    constructor(filesService) {
        this.filesService = filesService;
    }
    async execCommand(args) {
        const ls = spawn('ffmpeg', args);
        console.log(`ffmpeg process start`);
        console.log(`============================================`);
        return new Promise((resolve, reject) => {
            ls.stdout.on('data', data => {
                console.log(`stdout: ${data}`);
            });
            ls.stderr.on('data', data => {
                console.log(`stderr: ${data}`);
            });
            ls.on('error', (error) => {
                reject(`error: ${error.message}`);
            });
            ls.on('close', code => {
                resolve();
                console.log(`ffmpeg process exited with code ${code}`);
                console.log(`============================================`);
            });
        });
    }
    getFilePathByName(fileName) {
        return path.join(__dirname, '..', '..', 'static', fileName);
    }
    async combineVideos({ first, second, offset }) {
        try {
            const firstFilePath = this.getFilePathByName(first);
            const secondFilePath = this.getFilePathByName(second);
            const videoFormat = await this.filesService.getFormatFromFileName(first);
            const resultFileName = this.filesService.generateTempFileName(videoFormat);
            const resultFilePath = this.getFilePathByName(resultFileName);
            console.log('resultFilePath');
            console.log(resultFilePath);
            await this.execCommand([
                '-i', firstFilePath,
                '-i', secondFilePath,
                '-filter_complex', '[0]settb=AVTB[v0];[1]settb=AVTB[v1]; [v0][v1]xfade=transition=hlslice:duration=1:offset=5,format=yuv420p',
                resultFilePath
            ]);
            return resultFileName;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException();
        }
    }
    async nextFileGenerationWrap(originalFileName, callback) {
        try {
            const format = await this.filesService.getFormatFromFileName(originalFileName);
            const originalFilePath = path.join(__dirname, '..', '..', 'static', originalFileName);
            const newFileName = this.filesService.generateTempFileName(format);
            const newFilePath = this.getFilePathByName(newFileName);
            await callback(originalFilePath, newFilePath);
            this.removeFile(originalFilePath);
            return newFileName;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException();
        }
    }
    async videoCropExec(originalFileName, { cropLeft, cropRight }) {
        return await this.nextFileGenerationWrap(originalFileName, async (originalFilePath, newFilePath) => {
            await this.execCommand([
                '-ss', cropLeft || '0',
                '-i', originalFilePath,
                '-c', 'copy', '-t', cropRight || '0',
                newFilePath
            ]);
        });
    }
    removeFile(filePath) {
        fs.unlinkSync(filePath);
    }
    async videoAddAudioExec(originalFileName, audioFile) {
        if (!audioFile) {
            return originalFileName;
        }
        const audioFileName = await this.filesService.createFile(audioFile);
        const audioFilePath = await this.getFilePathByName(audioFileName);
        return await this.nextFileGenerationWrap(originalFileName, async (originalFilePath, newFilePath) => {
            await this.execCommand(['-i', audioFilePath, '-i', originalFilePath, '-shortest', newFilePath]);
            this.removeFile(audioFilePath);
        });
    }
    async videoFiltersExec(originalFileName, props) {
        if (Object.entries(props).every(item => !item)) {
            return originalFileName;
        }
        const { brightness, contrast, saturation, gamma } = props;
        return await this.nextFileGenerationWrap(originalFileName, async (originalFilePath, newFilePath) => {
            const brightnessString = brightness ? 'brightness=' + brightness : '';
            const contrastString = contrast ? 'contrast=' + contrast : '';
            const saturationString = saturation ? 'saturation=' + saturation : '';
            const gammaString = gamma ? 'gamma=' + gamma : '';
            const eqString = [brightnessString, contrastString, saturationString, gammaString]
                .filter(item => item)
                .join(':');
            await this.execCommand([
                '-i', originalFilePath,
                '-vf',
                `eq=${eqString}`,
                newFilePath
            ]);
        });
    }
    async generateVideo({ cropLeft, cropRight, brightness, contrast, gamma, saturation }, video, audio) {
        try {
            let videoName = await this.filesService.createFile(video);
            videoName = await this.videoAddAudioExec(videoName, audio);
            videoName = await this.videoFiltersExec(videoName, { brightness, contrast, gamma, saturation });
            return videoName;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException();
        }
    }
};
FfmpegService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [files_service_1.FilesService])
], FfmpegService);
exports.FfmpegService = FfmpegService;
//# sourceMappingURL=ffmpeg.service.js.map