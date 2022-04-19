"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FfmpegService = void 0;
const common_1 = require("@nestjs/common");
const { spawn } = require('child_process');
const fs = require('fs');
const path = require("path");
const filePath = path.join(__dirname, '..', '..', 'static', 'sample_960x400_ocean_with_audio.flv');
const resultFile = path.join(__dirname, '..', '..', 'static', 'sample.mp4');
let FfmpegService = class FfmpegService {
    async convertVideo() {
        const ls = spawn('ffmpeg', ['-i', filePath, resultFile]);
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
            const isFileExists = fs.existsSync(resultFile);
            if (isFileExists) {
                fs.unlinkSync(resultFile);
            }
            this.convertVideo();
        }
        catch (e) {
            throw new common_1.InternalServerErrorException();
        }
    }
};
FfmpegService = __decorate([
    (0, common_1.Injectable)()
], FfmpegService);
exports.FfmpegService = FfmpegService;
//# sourceMappingURL=ffmpeg.service.js.map