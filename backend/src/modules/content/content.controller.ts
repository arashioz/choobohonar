import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ContentService } from './content.service';
import { CreateJobDto } from './dto/create-job.dto';
import { ReviewJobDto } from './dto/review-job.dto';

@Controller('content')
export class ContentController {
  constructor(private contentService: ContentService) {}

  @Post('jobs')
  createJob(@Body() dto: CreateJobDto) {
    return this.contentService.createJob(dto);
  }

  @Get('jobs')
  listJobs(@Query('status') status?: string) {
    return this.contentService.listJobs(status);
  }

  @Get('jobs/:id')
  getJob(@Param('id') id: string) {
    return this.contentService.getJob(id);
  }

  @Patch('jobs/:id/review')
  reviewJob(@Param('id') id: string, @Body() dto: ReviewJobDto) {
    return this.contentService.reviewJob(id, dto);
  }

  @Patch('jobs/:id/publish')
  publishJob(@Param('id') id: string) {
    return this.contentService.publishJob(id);
  }

  @Get('stats')
  getStats() {
    return this.contentService.getQueueStats();
  }
}
