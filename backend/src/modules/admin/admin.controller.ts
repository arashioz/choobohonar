import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import * as jwt from 'jsonwebtoken';
import multer from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/jwt.guard';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme_secret';

@Controller('admin')
export class AdminController {
  @Post('login')
  async login(@Body() body: { username: string; password: string }, @Res() res: Response) {
    const adminUser = process.env.ADMIN_USER || 'admin';
    const adminPass = process.env.ADMIN_PASS || 'changeme';
    if (body.username === adminUser && body.password === adminPass) {
      const token = jwt.sign({ sub: body.username }, JWT_SECRET, { expiresIn: '8h' });
      return res.status(HttpStatus.OK).json({ token });
    }
    return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid credentials' });
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExt = extname(file.originalname);
          cb(null, `${uniqueSuffix}${fileExt}`);
        },
      }),
    }),
  )
  @Post('upload')
  async uploadFile(@UploadedFile() file: any, @Res() res: Response, @Req() req: Request) {
    if (!file) return res.status(HttpStatus.BAD_REQUEST).json({ message: 'No file uploaded' });
    const url = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    return res.status(HttpStatus.OK).json({ filename: file.filename, url });
  }

  @Get('health')
  health(@Res() res: Response) {
    return res.status(HttpStatus.OK).json({ status: 'ok' });
  }
}
