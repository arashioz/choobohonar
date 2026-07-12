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
import { promises as fs } from 'fs';
import { join } from 'path';
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

    const url = `${protocol}://${publicHost}/uploads/${file.filename}`;

    // If a "target" was provided, persist the mapping so the admin dashboard
    // can show which site slots have an uploaded asset.
    const target = (req as any).body?.target;
    if (target) {
      try {
        const mapPath = join(process.cwd(), 'backend', 'uploads', 'map.json');
        let map: Record<string, { filename: string; url: string }> = {};
        try {
          const raw = await fs.readFile(mapPath, 'utf-8');
          map = JSON.parse(raw);
        } catch (e) {
          // ignore if file doesn't exist
        }

        map[target] = { filename: file.filename, url };
        await fs.writeFile(mapPath, JSON.stringify(map, null, 2), 'utf-8');
      } catch (e) {
        // don't fail the upload if persisting mapping fails
        console.error('Failed to persist upload mapping', e);
      }
    }

    return res.status(HttpStatus.OK).json({
      filename: file.filename,
      url,
      target,
    });
  }

  @Get('assets')
  async listAssets(@Res() res: Response) {
    const uploadsDir = join(process.cwd(), 'backend', 'uploads');
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

    const mapPath = join(process.cwd(), 'backend', 'uploads', 'map.json');
    let map: Record<string, { filename: string; url: string }> = {};
    try {
      const raw = await fs.readFile(mapPath, 'utf-8');
      map = JSON.parse(raw);
    } catch (e) {
      // ignore if not present
    }

    const targets = knownTargets.map((t) => ({ name: t, mapping: map[t] ?? null }));
    return res.status(HttpStatus.OK).json({ targets });
  }

  @Get('health')
  health(@Res() res: Response) {
    return res.status(HttpStatus.OK).json({
      status: 'ok',
    });
  }
}