import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lead, LeadDocument } from './schemas/lead.schema';
import {
  InteriorBrief,
  InteriorBriefDocument,
} from './schemas/interior-brief.schema';
import { CreateLeadDto } from './dto/create-lead.dto';
import { CreateInteriorBriefDto } from './dto/create-interior-brief.dto';
import { UpdateLeadStatusDto } from './dto/update-lead-status.dto';

@Injectable()
export class LeadsService {
  constructor(
    @InjectModel(Lead.name) private leadModel: Model<LeadDocument>,
    @InjectModel(InteriorBrief.name)
    private briefModel: Model<InteriorBriefDocument>,
  ) {}

  async createLead(dto: CreateLeadDto): Promise<{ id: string; ok: true }> {
    const lead = await this.leadModel.create({
      type: dto.type,
      source: dto.source,
      name: dto.name.trim(),
      phone: dto.phone.trim(),
      email: dto.email?.trim() || undefined,
      data: dto.data ?? {},
      status: 'new',
    });

    return { id: lead._id.toString(), ok: true };
  }

  async listLeads(type?: string, status?: string): Promise<LeadDocument[]> {
    const filter: Record<string, string> = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    return this.leadModel.find(filter).sort({ createdAt: -1 }).limit(100).exec();
  }

  async getLead(id: string): Promise<LeadDocument> {
    const lead = await this.leadModel.findById(id).exec();
    if (!lead) throw new NotFoundException(`Lead ${id} not found`);
    return lead;
  }

  async updateLeadStatus(
    id: string,
    dto: UpdateLeadStatusDto,
  ): Promise<LeadDocument> {
    const updated = await this.leadModel
      .findByIdAndUpdate(
        id,
        {
          status: dto.status,
          ...(dto.adminNote !== undefined ? { adminNote: dto.adminNote } : {}),
        },
        { new: true },
      )
      .exec();
    if (!updated) throw new NotFoundException(`Lead ${id} not found`);
    return updated;
  }

  async createInteriorBrief(
    dto: CreateInteriorBriefDto,
  ): Promise<{ id: string; ok: true }> {
    const brief = await this.briefModel.create({
      styles: dto.styles,
      moodboardRound1: dto.moodboardRound1,
      moodboardRound2: dto.moodboardRound2,
      location: dto.location.trim(),
      area: dto.area.trim(),
      spaceType: dto.spaceType,
      roomCount: dto.roomCount?.trim() || '',
      budget: dto.budget || '',
      timeline: dto.timeline || '',
      consultation: dto.consultation,
      name: dto.name.trim(),
      phone: dto.phone.trim(),
      email: dto.email?.trim() || undefined,
      notes: dto.notes?.trim() || undefined,
      status: 'new',
    });

    return { id: brief._id.toString(), ok: true };
  }

  async listInteriorBriefs(status?: string): Promise<InteriorBriefDocument[]> {
    const filter = status ? { status } : {};
    return this.briefModel.find(filter).sort({ createdAt: -1 }).limit(100).exec();
  }

  async getInteriorBrief(id: string): Promise<InteriorBriefDocument> {
    const brief = await this.briefModel.findById(id).exec();
    if (!brief) throw new NotFoundException(`Interior brief ${id} not found`);
    return brief;
  }

  async updateInteriorBriefStatus(
    id: string,
    dto: UpdateLeadStatusDto,
  ): Promise<InteriorBriefDocument> {
    const updated = await this.briefModel
      .findByIdAndUpdate(
        id,
        {
          status: dto.status,
          ...(dto.adminNote !== undefined ? { adminNote: dto.adminNote } : {}),
        },
        { new: true },
      )
      .exec();
    if (!updated) throw new NotFoundException(`Interior brief ${id} not found`);
    return updated;
  }
}
