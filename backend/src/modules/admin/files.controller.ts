import {
  Controller,
  Get,
  Post,
  Delete,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { File as MulterFile } from 'multer';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { FilesService, ListFilesDto } from './files.service';
import { join } from 'path';

@Controller('admin/files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  async listFiles(@Query() query: ListFilesDto) {
    return this.filesService.listFiles(query);
  }

  @Delete()
  async deleteItem(@Body('path') path: string) {
    return this.filesService.deleteItem(path);
  }

  @Post('folder')
  async createFolder(
    @Body('path') parentPath: string,
    @Body('name') folderName: string,
  ) {
    if (!folderName || !folderName.trim()) {
      throw new BadRequestException('نام پوشه الزامی است');
    }
    return this.filesService.createFolder(parentPath, folderName);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: join(process.cwd(), 'uploads'),
      limits: {
        fileSize: 500 * 1024 * 1024, // 500MB
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: MulterFile,
    @Body('path') parentPath: string,
  ) {
    return this.filesService.saveUploadedFile(parentPath, file);
  }
}
