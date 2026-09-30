import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join, resolve, relative, extname, basename } from 'path';
import type { File as MulterFile } from 'multer';

export type FileCategory =
  | 'image'
  | 'video'
  | 'audio'
  | 'document'
  | 'archive'
  | 'other';

export interface FileEntryItem {
  name: string;
  path: string;
  isDirectory: boolean;
  size: number;
  updatedAt: string;
  extension?: string;
  category?: FileCategory;
  url?: string;
  itemsCount?: number;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export class ListFilesDto {
  path?: string;
  search?: string;
  type?: 'all' | 'images' | 'videos' | 'documents' | 'folders';
  sort?:
    | 'name_asc'
    | 'name_desc'
    | 'date_asc'
    | 'date_desc'
    | 'size_asc'
    | 'size_desc';
  page?: number;
  limit?: number;
}

export type ListFilesOptions = ListFilesDto;

export interface ListFilesResult {
  currentPath: string;
  breadcrumbs: BreadcrumbItem[];
  items: FileEntryItem[];
  foldersCount: number;
  filesCount: number;
  totalItems: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class FilesService {
  private readonly baseDir = resolve(process.cwd(), 'uploads');

  constructor() {
    this.ensureBaseDir();
  }

  private async ensureBaseDir() {
    try {
      await fs.mkdir(this.baseDir, { recursive: true });
    } catch {
      // Ignore if exists
    }
  }

  /**
   * Safely resolves a subpath relative to the uploads root directory,
   * preventing path traversal outside of uploads.
   */
  resolveSafePath(subpath: string = ''): string {
    const normalized = (subpath || '').replace(/\\/g, '/').trim();
    // Strip leading slashes to prevent root escapes
    const cleanSub = normalized.replace(/^\/+/, '');
    const target = resolve(this.baseDir, cleanSub);

    if (target !== this.baseDir && !target.startsWith(this.baseDir + '/')) {
      throw new BadRequestException('مسیر درخواستی نامعتبر یا غیرمجاز است');
    }
    return target;
  }

  getRelativePath(fullPath: string): string {
    const rel = relative(this.baseDir, fullPath).replace(/\\/g, '/');
    return rel === '.' ? '' : rel;
  }

  detectCategory(ext: string): FileCategory {
    const e = ext.toLowerCase().replace(/^\./, '');
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif', 'bmp', 'ico'].includes(e)) {
      return 'image';
    }
    if (['mp4', 'webm', 'mov', 'avi', 'mkv', 'm4v', 'ogv'].includes(e)) {
      return 'video';
    }
    if (['mp3', 'wav', 'ogg', 'aac', 'm4a', 'flac'].includes(e)) {
      return 'audio';
    }
    if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'csv', 'txt', 'json', 'md'].includes(e)) {
      return 'document';
    }
    if (['zip', 'rar', 'tar', 'gz', '7z', 'bz2'].includes(e)) {
      return 'archive';
    }
    return 'other';
  }

  buildBreadcrumbs(relPath: string): BreadcrumbItem[] {
    const crumbs: BreadcrumbItem[] = [{ name: 'uploads', path: '' }];
    if (!relPath) return crumbs;

    const segments = relPath.split('/').filter(Boolean);
    let accum = '';
    for (const seg of segments) {
      accum = accum ? `${accum}/${seg}` : seg;
      crumbs.push({ name: seg, path: accum });
    }
    return crumbs;
  }

  async listFiles(options: ListFilesOptions = {}): Promise<ListFilesResult> {
    await this.ensureBaseDir();

    const targetDir = this.resolveSafePath(options.path || '');
    let stat;
    try {
      stat = await fs.stat(targetDir);
    } catch {
      throw new NotFoundException('پوشه مورد نظر یافت نشد');
    }

    if (!stat.isDirectory()) {
      throw new BadRequestException('مسیر مشخص شده یک پوشه نیست');
    }

    const currentRelPath = this.getRelativePath(targetDir);
    const breadcrumbs = this.buildBreadcrumbs(currentRelPath);

    const dirEntries = await fs.readdir(targetDir, { withFileTypes: true });

    let items: FileEntryItem[] = await Promise.all(
      dirEntries.map(async (entry) => {
        const itemFullPath = join(targetDir, entry.name);
        const itemRelPath = this.getRelativePath(itemFullPath);
        const isDir = entry.isDirectory();

        let size = 0;
        let updatedAt = new Date().toISOString();
        let itemsCount: number | undefined;

        try {
          const itemStat = await fs.stat(itemFullPath);
          size = itemStat.size;
          updatedAt = itemStat.mtime.toISOString();

          if (isDir) {
            try {
              const children = await fs.readdir(itemFullPath);
              itemsCount = children.length;
            } catch {
              itemsCount = 0;
            }
          }
        } catch {
          // If stat fails (e.g. broken symlink)
        }

        const ext = isDir ? undefined : extname(entry.name);
        const category = isDir ? undefined : this.detectCategory(ext || '');
        const url = isDir
          ? undefined
          : `/uploads/${encodeURI(itemRelPath).replace(/%2F/g, '/')}`;

        return {
          name: entry.name,
          path: itemRelPath,
          isDirectory: isDir,
          size,
          updatedAt,
          extension: ext ? ext.replace('.', '').toLowerCase() : undefined,
          category,
          url,
          itemsCount,
        };
      }),
    );

    // Filter hidden files/system files if any
    items = items.filter((item) => !item.name.startsWith('.'));

    // Search filter
    if (options.search?.trim()) {
      const q = options.search.trim().toLowerCase();
      items = items.filter((item) => item.name.toLowerCase().includes(q));
    }

    // Type filter
    if (options.type && options.type !== 'all') {
      if (options.type === 'folders') {
        items = items.filter((item) => item.isDirectory);
      } else if (options.type === 'images') {
        items = items.filter((item) => !item.isDirectory && item.category === 'image');
      } else if (options.type === 'videos') {
        items = items.filter((item) => !item.isDirectory && item.category === 'video');
      } else if (options.type === 'documents') {
        items = items.filter((item) => !item.isDirectory && item.category === 'document');
      }
    }

    const foldersCount = items.filter((i) => i.isDirectory).length;
    const filesCount = items.filter((i) => !i.isDirectory).length;

    // Sorting
    const sort = options.sort || 'name_asc';
    items.sort((a, b) => {
      // Keep folders on top unless specific size/date sort
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;

      switch (sort) {
        case 'name_desc':
          return b.name.localeCompare(a.name, undefined, { numeric: true, sensitivity: 'base' });
        case 'date_asc':
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        case 'date_desc':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'size_asc':
          return a.size - b.size;
        case 'size_desc':
          return b.size - a.size;
        case 'name_asc':
        default:
          return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
      }
    });

    const totalItems = items.length;
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Math.min(500, Number(options.limit) || 100));
    const totalPages = Math.ceil(totalItems / limit) || 1;
    const paginatedItems = items.slice((page - 1) * limit, page * limit);

    return {
      currentPath: currentRelPath,
      breadcrumbs,
      items: paginatedItems,
      foldersCount,
      filesCount,
      totalItems,
      page,
      limit,
      totalPages,
    };
  }

  async deleteItem(itemPath: string): Promise<{ success: boolean; message: string }> {
    if (!itemPath || !itemPath.trim()) {
      throw new BadRequestException('مسیر فایل یا پوشه برای حذف ارسال نشده است');
    }

    const target = this.resolveSafePath(itemPath);

    if (target === this.baseDir) {
      throw new BadRequestException('امکان حذف پوشه اصلی آپلودها وجود ندارد');
    }

    let stat;
    try {
      stat = await fs.stat(target);
    } catch {
      throw new NotFoundException('فایل یا پوشه مورد نظر یافت نشد');
    }

    if (stat.isDirectory()) {
      await fs.rm(target, { recursive: true, force: true });
      return { success: true, message: 'پوشه و محتویات آن با موفقیت حذف شدند' };
    } else {
      await fs.unlink(target);
      return { success: true, message: 'فایل با موفقیت حذف شد' };
    }
  }

  async createFolder(parentPath: string = '', folderName: string): Promise<{ success: boolean; path: string; message: string }> {
    const cleanName = (folderName || '')
      .replace(/[/\\?%*:|"<>]/g, '-')
      .replace(/\s+/g, '-')
      .trim();

    if (!cleanName || cleanName === '.' || cleanName === '..') {
      throw new BadRequestException('نام پوشه نامعتبر است');
    }

    const parentDir = this.resolveSafePath(parentPath);
    const targetDir = join(parentDir, cleanName);

    // Validate stays inside baseDir
    if (!targetDir.startsWith(this.baseDir)) {
      throw new BadRequestException('مسیر ساخت پوشه غیرمجاز است');
    }

    try {
      await fs.access(targetDir);
      throw new BadRequestException('پوشه‌ای با این نام قبلاً ایجاد شده است');
    } catch (err: any) {
      if (err instanceof BadRequestException) throw err;
      // Not existing, proceed
    }

    await fs.mkdir(targetDir, { recursive: true });
    const relPath = this.getRelativePath(targetDir);

    return {
      success: true,
      path: relPath,
      message: `پوشه «${cleanName}» با موفقیت ایجاد شد`,
    };
  }

  async saveUploadedFile(
    parentPath: string = '',
    file: MulterFile,
  ): Promise<{ success: boolean; filename: string; path: string; url: string }> {
    if (!file) {
      throw new BadRequestException('فایلی برای آپلود ارسال نشده است');
    }

    const targetDir = this.resolveSafePath(parentPath);
    await fs.mkdir(targetDir, { recursive: true });

    // Sanitize original filename
    const ext = extname(file.originalname);
    const rawBase = basename(file.originalname, ext);
    const cleanBase = rawBase
      .replace(/[/\\?%*:|"<>]/g, '-')
      .replace(/\s+/g, '-')
      .slice(0, 60);

    const safeFilename = `${cleanBase || 'file'}-${Date.now()}${ext.toLowerCase()}`;
    const destinationPath = join(targetDir, safeFilename);

    // If multer stored it in a temp location (file.path), move it
    if (file.path) {
      await fs.rename(file.path, destinationPath);
    } else if (file.buffer) {
      await fs.writeFile(destinationPath, file.buffer);
    } else {
      throw new BadRequestException('اطلاعات فایل بارگذاری شده ناقص است');
    }

    const relPath = this.getRelativePath(destinationPath);
    const url = `/uploads/${encodeURI(relPath).replace(/%2F/g, '/')}`;

    return {
      success: true,
      filename: safeFilename,
      path: relPath,
      url,
    };
  }
}
