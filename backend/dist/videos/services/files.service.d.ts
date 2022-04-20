export declare class FilesService {
    createFile(file: any): Promise<string>;
    getFormatFromFile(file: any): any;
    getFormatFromFileName(fileName: any): any;
    generateTempFileName(format: string): string;
}
