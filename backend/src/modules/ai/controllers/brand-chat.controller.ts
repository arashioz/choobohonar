import { Controller, Post, Body, Get, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { BrandRagService } from '../services/brand-rag.service';

export class QueryBrandDto {
  message: string;
}

@Controller('ai/brand-chat')
export class BrandChatController {
  constructor(private readonly brandRagService: BrandRagService) {}

  @Post('query')
  @HttpCode(HttpStatus.OK)
  async queryBrand(@Body() dto: QueryBrandDto) {
    if (!dto || !dto.message) {
      return { error: 'پیام ارسال‌شده نمی‌تواند خالی باشد.' };
    }
    return await this.brandRagService.chatWithBrand(dto.message);
  }

  @Get('search')
  async searchKnowledge(@Query('q') q: string) {
    return await this.brandRagService.searchSimilar(q || 'چوب و هنر');
  }

  @Post('seed')
  @HttpCode(HttpStatus.OK)
  async seedKnowledge() {
    await this.brandRagService.seedBrandVectorStore();
    return { status: 'دیتابیس امبدینگ چوب و هنر با موفقیت بارگذاری گردید.' };
  }
}
