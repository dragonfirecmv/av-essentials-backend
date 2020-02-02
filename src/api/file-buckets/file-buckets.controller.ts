import { Controller, Post, Req, Res, Body, UseInterceptors, UploadedFile, Delete, Param, UseGuards } from '@nestjs/common';
import { FileBucketsService } from './file-buckets.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/decorator/users.decorator';

@Controller('api/buckets')
export class FileBucketsController {

  constructor(
    private readonly fileBucketsService: FileBucketsService
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @User('id') userId,
    @UploadedFile() file,
    @Res() res
  ) {
    // return { file }
    return this.fileBucketsService.fileUpload(file, res, userId)
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  deleteFileByName(
    @User('id') userId,
    @Body() payload: { filename: string }
  ) {
    return this.fileBucketsService.fileRemove(payload, userId)
  }
}