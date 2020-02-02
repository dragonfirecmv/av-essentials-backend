import { Module } from '@nestjs/common';
import { FileBucketsService } from './file-buckets.service';
import { FileBucketsController } from './file-buckets.controller';

@Module({
  providers: [FileBucketsService],
  controllers: [FileBucketsController]
})
export class FileBucketsModule {}
