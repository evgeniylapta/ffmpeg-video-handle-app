"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
const uuid = require("uuid");
let FilesService = class FilesService {
    async createFile(file) {
        try {
            const format = this.getFormatFromFile(file);
            const fileName = this.generateTempFileName(format);
            const filePath = path.resolve(__dirname, '..', '..', 'static');
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, { recursive: true });
            }
            fs.writeFileSync(path.join(filePath, fileName), file.buffer);
            return fileName;
        }
        catch (_a) {
            throw new common_1.InternalServerErrorException();
        }
    }
    getFormatFromFile(file) {
        return this.getFormatFromFileName(file.originalname);
    }
    getFormatFromFileName(fileName) {
        const [, format] = fileName.split('.');
        return format;
    }
    generateTempFileName(format) {
        return `${uuid.v4()}.${format}`;
    }
};
FilesService = __decorate([
    (0, common_1.Injectable)()
], FilesService);
exports.FilesService = FilesService;
//# sourceMappingURL=files.service.js.map