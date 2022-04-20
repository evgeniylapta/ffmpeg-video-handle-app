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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideosController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const ffmpeg_service_1 = require("./services/ffmpeg.service");
const files_service_1 = require("./services/files.service");
const add_video_dto_1 = require("./dto/add-video.dto");
const combine_videos_dto_1 = require("./dto/combine-videos.dto");
let VideosController = class VideosController {
    constructor(ffmpegService, filesService) {
        this.ffmpegService = ffmpegService;
        this.filesService = filesService;
    }
    addVideo(dto, files) {
        var _a, _b;
        const video = (_a = files.video) === null || _a === void 0 ? void 0 : _a[0];
        const audio = (_b = files.audio) === null || _b === void 0 ? void 0 : _b[0];
        return this.ffmpegService.generateVideo(dto, video, audio);
    }
    combineVideos(dto) {
        return this.ffmpegService.combineVideos(dto);
    }
};
__decorate([
    (0, common_1.Post)('edit'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'video', maxCount: 1 },
        { name: 'audio', maxCount: 1 },
    ])),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [add_video_dto_1.GenerateVideoDto, Object]),
    __metadata("design:returntype", void 0)
], VideosController.prototype, "addVideo", null);
__decorate([
    (0, common_1.Post)('combine'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [combine_videos_dto_1.CombineVideosDto]),
    __metadata("design:returntype", void 0)
], VideosController.prototype, "combineVideos", null);
VideosController = __decorate([
    (0, common_1.Controller)('videos'),
    __metadata("design:paramtypes", [ffmpeg_service_1.FfmpegService, files_service_1.FilesService])
], VideosController);
exports.VideosController = VideosController;
//# sourceMappingURL=videos.controller.js.map