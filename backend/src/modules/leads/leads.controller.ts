import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { CreateInteriorBriefDto } from './dto/create-interior-brief.dto';
import { UpdateLeadStatusDto } from './dto/update-lead-status.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller()
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  /** Public — فرم‌های تماس / مشاوره / همکاری / نمایندگی */
  @Post('lead')
  createLead(@Body() dto: CreateLeadDto) {
    return this.leadsService.createLead(dto);
  }

  /** Public — فرم هوشمند معماری داخلی */
  @Post('interior-brief')
  createInteriorBrief(@Body() dto: CreateInteriorBriefDto) {
    return this.leadsService.createInteriorBrief(dto);
  }

  @Get('lead')
  @UseGuards(JwtAuthGuard)
  listLeads(
    @Query('type') type?: string,
    @Query('status') status?: string,
  ) {
    return this.leadsService.listLeads(type, status);
  }

  @Get('lead/:id')
  @UseGuards(JwtAuthGuard)
  getLead(@Param('id') id: string) {
    return this.leadsService.getLead(id);
  }

  @Patch('lead/:id')
  @UseGuards(JwtAuthGuard)
  updateLeadStatus(@Param('id') id: string, @Body() dto: UpdateLeadStatusDto) {
    return this.leadsService.updateLeadStatus(id, dto);
  }

  @Delete('lead/:id')
  @UseGuards(JwtAuthGuard)
  removeLead(@Param('id') id: string) {
    return this.leadsService.removeLead(id);
  }

  @Get('interior-brief')
  @UseGuards(JwtAuthGuard)
  listInteriorBriefs(@Query('status') status?: string) {
    return this.leadsService.listInteriorBriefs(status);
  }

  @Get('interior-brief/:id')
  @UseGuards(JwtAuthGuard)
  getInteriorBrief(@Param('id') id: string) {
    return this.leadsService.getInteriorBrief(id);
  }

  @Patch('interior-brief/:id')
  @UseGuards(JwtAuthGuard)
  updateInteriorBriefStatus(
    @Param('id') id: string,
    @Body() dto: UpdateLeadStatusDto,
  ) {
    return this.leadsService.updateInteriorBriefStatus(id, dto);
  }

  @Delete('interior-brief/:id')
  @UseGuards(JwtAuthGuard)
  removeInteriorBrief(@Param('id') id: string) {
    return this.leadsService.removeInteriorBrief(id);
  }
}
