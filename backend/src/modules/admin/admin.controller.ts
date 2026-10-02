import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  InternalServerErrorException,
  UseInterceptors,
  UploadedFile,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { promises as fs } from 'fs';
import { extname, join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import type { File as MulterFile } from 'multer';
import { JwtAuthGuard } from '../auth/jwt.guard';

// Note: we use multer via the FileInterceptor; multer's diskStorage
// packaging can vary between builds. The interceptor below uses the
// simpler `dest` option which is robust across environments.

@Controller('admin')
export class AdminController {
  @Post('login')
  async login(
    @Body() body: { username: string; password: string },
    @Res() res: Response,
  ) {
    const adminUser = process.env.ADMIN_USER;
    const adminPass = process.env.ADMIN_PASS;
    const jwtSecret = process.env.JWT_SECRET;

    if (!adminUser || !adminPass || !jwtSecret) {
      throw new InternalServerErrorException(
        'Admin authentication is not configured',
      );
    }

    if (body.username === adminUser && body.password === adminPass) {
      const token = jwt.sign({ sub: body.username }, jwtSecret, {
        expiresIn: '8h',
      });

      res.cookie('admin_session', token, {
        httpOnly: true,
        sameSite: 'lax',
        // Site is currently served over HTTP; enable only when HTTPS is forced.
        secure: process.env.FORCE_HTTPS === 'true',
        path: '/',
        maxAge: 8 * 60 * 60 * 1000,
      });

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
      dest: join(process.cwd(), 'uploads'),

      limits: {
        fileSize: 500 * 1024 * 1024,
      },

      fileFilter: (_req, file, cb) => {
        const ok =
          file.mimetype.startsWith('image/') ||
          file.mimetype.startsWith('video/');

        if (!ok) {
          return cb(new Error('Only image and video files are allowed'), false);
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

    // Multer's `dest` drops the original extension, so nginx serves the file
    // as application/octet-stream and browsers skip hero videos. Keep a
    // known media extension so the public URL has the right content type.
    const rawExt = extname(file.originalname).toLowerCase();
    const safeExt = /^\.(mp4|webm|mov|m4v|jpe?g|png|webp|gif|avif)$/.test(rawExt)
      ? rawExt
      : '';
    let filename = file.filename;
    if (safeExt && !filename.toLowerCase().endsWith(safeExt)) {
      filename = `${filename}${safeExt}`;
      await fs.rename(
        join(process.cwd(), 'uploads', file.filename),
        join(process.cwd(), 'uploads', filename),
      );
    }

    // A relative URL works through both the development proxy and production
    // nginx, unlike an internal Docker hostname such as backend:3001.
    const url = `/uploads/${filename}`;

    // If a "target" was provided, persist the mapping so the admin dashboard
    // can show which site slots have an uploaded asset.
    const target = (req as any).body?.target;
    if (target) {
      try {
        const mapPath = join(process.cwd(), 'uploads', 'map.json');
        let map: Record<string, { filename: string; url: string }> = {};
        try {
          const raw = await fs.readFile(mapPath, 'utf-8');
          map = JSON.parse(raw);
        } catch (e) {
          // ignore if file doesn't exist
        }

        map[target] = { filename, url };
        await fs.writeFile(mapPath, JSON.stringify(map, null, 2), 'utf-8');
      } catch (e) {
        // don't fail the upload if persisting mapping fails
        console.error('Failed to persist upload mapping', e);
      }
    }

    return res.status(HttpStatus.OK).json({
      filename,
      url,
      target,
    });
  }

  @Get('assets')
  async listAssets(@Res() res: Response) {
    const uploadsDir = join(process.cwd(), 'uploads');
    try {
      const files = await fs.readdir(uploadsDir);
      return res.status(HttpStatus.OK).json({ files });
    } catch (e) {
      return res.status(HttpStatus.OK).json({ files: [] });
    }
  }

  @Get('targets')
  async listTargets(@Res() res: Response) {
    // Known targets across the frontend (seed list). This can be extended.
    const knownTargets = [
      'hero',
      'gallery',
      'logo',
      'monogram',
      'slogan',
      'product-placeholder',
    ];

    const mapPath = join(process.cwd(), 'uploads', 'map.json');
    let map: Record<string, { filename: string; url: string }> = {};
    try {
      const raw = await fs.readFile(mapPath, 'utf-8');
      map = JSON.parse(raw);
    } catch (e) {
      // ignore if not present
    }

    const targets = knownTargets.map((t) => ({
      name: t,
      mapping: map[t] ?? null,
    }));
    return res.status(HttpStatus.OK).json({ targets });
  }

  @Get('health')
  health(@Res() res: Response) {
    return res.status(HttpStatus.OK).json({
      status: 'ok',
    });
  }
}
