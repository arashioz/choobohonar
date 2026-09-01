import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CollectionsService } from './collections.service';

@Controller('collections')
@UseGuards(JwtAuthGuard)
export class CollectionsAdminController {
  constructor(private readonly collections: CollectionsService) {}

  @Get()
  list(@Query('q') q?: string, @Query('status') status?: string) {
    return this.collections.list(q, status);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.collections.get(id);
  }

  @Post()
  create(@Body() body: Record<string, unknown>) {
    return this.collections.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.collections.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.collections.remove(id);
  }
}

@Controller('public/collections')
export class CollectionsPublicController {
  constructor(private readonly collections: CollectionsService) {}

  @Get()
  list() {
    return this.collections.publicList();
  }

  @Get(':slug')
  async get(@Param('slug') slug: string) {
    const collection = await this.collections.getBySlug(slug);
    return collection;
  }
}
