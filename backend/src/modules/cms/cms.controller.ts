import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CmsService } from './cms.service';

@Controller('admin/cms')
@UseGuards(JwtAuthGuard)
export class CmsAdminController {
  constructor(private readonly cmsService: CmsService) {}

  @Get(':kind')
  list(@Param('kind') kind: string, @Query('q') query?: string, @Query('status') status?: string, @Query('limit') limit?: string) {
    return this.cmsService.list(kind, query, status, limit);
  }

  @Post(':kind')
  create(@Param('kind') kind: string, @Body() body: Record<string, unknown>) {
    return this.cmsService.create(kind, body);
  }

  @Get(':kind/:id')
  get(@Param('kind') kind: string, @Param('id') id: string) {
    return this.cmsService.get(kind, id);
  }

  @Patch(':kind/:id')
  update(@Param('kind') kind: string, @Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.cmsService.update(kind, id, body);
  }

  @Post(':kind/:id/publish')
  publish(@Param('kind') kind: string, @Param('id') id: string) {
    return this.cmsService.publish(kind, id);
  }

  @Post(':kind/:id/archive')
  archive(@Param('kind') kind: string, @Param('id') id: string) {
    return this.cmsService.archive(kind, id);
  }

  @Delete(':kind/:id')
  remove(@Param('kind') kind: string, @Param('id') id: string) {
    return this.cmsService.remove(kind, id);
  }
}

@Controller('cms')
export class CmsPublicController {
  constructor(private readonly cmsService: CmsService) {}

  @Get(':kind')
  list(@Param('kind') kind: string) {
    return this.cmsService.publicList(kind);
  }

  @Get(':kind/:slug')
  get(@Param('kind') kind: string, @Param('slug') slug: string) {
    return this.cmsService.publicList(kind, slug);
  }
}

// Public storefront alias kept separate from /cms, which is reserved by the
// admin proxy in production nginx.
@Controller('public-cms')
export class CmsStorefrontController {
  constructor(private readonly cmsService: CmsService) {}

  @Get(':kind')
  list(@Param('kind') kind: string) {
    return this.cmsService.publicList(kind);
  }

  @Get(':kind/:slug')
  get(@Param('kind') kind: string, @Param('slug') slug: string) {
    return this.cmsService.publicList(kind, slug);
  }
}
