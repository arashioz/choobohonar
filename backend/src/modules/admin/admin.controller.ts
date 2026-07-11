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
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import type { File as MulterFile } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/jwt.guard';

// multer packaging can export differently depending on ESM/CJS interop.
// Resolve diskStorage at runtime from either the imported object or its default.
const disk = ((multer as any).diskStorage ?? (multer as any).default?.diskStorage) as any;

const JWT_SECRET = process.env.JWT_SECRET || 'changeme_secret';

@Controller('admin')
export class AdminController {
  @Post('login')
  async login(
    @Body() body: { username: string; password: string },
    @Res() res: Response,
  ) {
    const adminUser = process.env.ADMIN_USER || 'admin';
    const adminPass = process.env.ADMIN_PASS || 'changeme';

    if (body.username === adminUser && body.password === adminPass) {
      const token = jwt.sign(
        { sub: body.username },
        JWT_SECRET,
        { expiresIn: '8h' },
      );

      return res.status(HttpStatus.OK).json({ token });
    }

    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: 'Invalid credentials' });
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: disk({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);

          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),

      limits: {
        fileSize: 200 * 1024 * 1024,
      },

      fileFilter: (_req, file, cb) => {
        const ok =
          file.mimetype.startsWith('image/') ||
          file.mimetype.startsWith('video/');

        if (!ok) {
          return cb(
            new Error('Only image and video files are allowed'),
            false,
          );
        }

        cb(null, true);
      },
    }),
  )
  @Post('upload')
  async uploadFile(
    @UploadedFile() file: MulterFile,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!file) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'No file uploaded' });
    }

    const publicHost = process.env.PUBLIC_HOST || req.get('host');
    const protocol =
      process.env.FORCE_HTTPS === 'true' ? 'https' : req.protocol;

    return res.status(HttpStatus.OK).json({
      filename: file.filename,
      url: `${protocol}://${publicHost}/uploads/${file.filename}`,
      target: (req as any).body?.target,
    });
  }

  @Get('health')
  health(@Res() res: Response) {
    return res.status(HttpStatus.OK).json({
      status: 'ok',
    });
  }
}