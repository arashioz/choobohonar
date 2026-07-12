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

// Note: we use multer via the FileInterceptor; multer's diskStorage
// packaging can vary between builds. The interceptor below uses the
// simpler `dest` option which is robust across environments.

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
      // Some multer builds/interop may not expose diskStorage in a predictable
      // way at import-time. Passing `dest` is a simpler, robust option that
      // tells multer to store files on disk under the given folder.
      dest: './uploads',

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