import { Module } from '@nestjs/common';
import { VideosModule } from './videos/videos.module';
import * as path from "path";
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    VideosModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, 'static'),
    }),
  ],
})
export class AppModule {}
