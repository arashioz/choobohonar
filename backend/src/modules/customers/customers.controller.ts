import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CustomersService } from './customers.service';

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(private readonly customers: CustomersService) {}
  @Get() list(@Query('q') q?: string, @Query('status') status?: string) { return this.customers.list(q, status); }
  @Get(':id') get(@Param('id') id: string) { return this.customers.get(id); }
  @Post() create(@Body() body: Record<string, unknown>) { return this.customers.create(body); }
  @Patch(':id') update(@Param('id') id: string, @Body() body: Record<string, unknown>) { return this.customers.update(id, body); }
  @Post(':id/notes') note(@Param('id') id: string, @Body() body: { text?: string }) { return this.customers.addNote(id, body.text || ''); }
  @Delete(':id') remove(@Param('id') id: string) { return this.customers.remove(id); }
}
