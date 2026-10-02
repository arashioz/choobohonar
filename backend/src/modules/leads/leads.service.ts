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
import { normalizeFollowUpStatus } from '../../common/follow-up-status';

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

  async listLeads(type?: string, status?: string) {
    const filter: Record<string, unknown> = {};
    if (type) filter.type = type;
    if (status) filter.status = this.statusFilter(status);
    const items = await this.leadModel
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
      .exec();
    return items.map((item) => this.present(item));
  }

  async getLead(id: string): Promise<LeadDocument> {
    const lead = await this.leadModel.findById(id).exec();
    if (!lead) throw new NotFoundException(`Lead ${id} not found`);
    return lead;
  }

  async updateLeadStatus(id: string, dto: UpdateLeadStatusDto) {
    const lead = await this.getLead(id);
    this.applyFollowUp(lead, dto);
    await lead.save();
    return this.present(lead);
  }

  async removeLead(id: string): Promise<{ ok: true }> {
    const removed = await this.leadModel.findByIdAndDelete(id).exec();
    if (!removed) throw new NotFoundException(`Lead ${id} not found`);
    return { ok: true };
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

  async listInteriorBriefs(status?: string) {
    const filter: Record<string, unknown> = {};
    if (status) filter.status = this.statusFilter(status);
    const items = await this.briefModel
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
      .exec();
    return items.map((item) => this.present(item));
  }

  async getInteriorBrief(id: string): Promise<InteriorBriefDocument> {
    const brief = await this.briefModel.findById(id).exec();
    if (!brief) throw new NotFoundException(`Interior brief ${id} not found`);
    return brief;
  }

  async updateInteriorBriefStatus(id: string, dto: UpdateLeadStatusDto) {
    const brief = await this.getInteriorBrief(id);
    this.applyFollowUp(brief, dto);
    await brief.save();
    return this.present(brief);
  }

  private statusFilter(status: string) {
    const normalized = normalizeFollowUpStatus(status);
    if (normalized === 'reviewed') return { $in: ['reviewed', 'read'] };
    return normalized;
  }

  private applyFollowUp(
    doc: {
      status: string;
      adminNote?: string;
      followUpHistory?: { from: string; to: string; at: Date; by: string }[];
    },
    dto: UpdateLeadStatusDto,
  ) {
    const from = normalizeFollowUpStatus(doc.status);
    const to = normalizeFollowUpStatus(dto.status);
    if (doc.status !== to) {
      if (!doc.followUpHistory) doc.followUpHistory = [];
      doc.followUpHistory.push({ from, to, at: new Date(), by: 'admin' });
      doc.status = to;
    }
    if (dto.adminNote !== undefined) doc.adminNote = dto.adminNote;
  }

  private present(doc: { toObject: () => Record<string, unknown> }) {
    const plain = doc.toObject();
    plain.status = normalizeFollowUpStatus(
      typeof plain.status === 'string' ? plain.status : undefined,
    );
    return plain;
  }

  async removeInteriorBrief(id: string): Promise<{ ok: true }> {
    const removed = await this.briefModel.findByIdAndDelete(id).exec();
    if (!removed) throw new NotFoundException(`Interior brief ${id} not found`);
    return { ok: true };
  }
}
