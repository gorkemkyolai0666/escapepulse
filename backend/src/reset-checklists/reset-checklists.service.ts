import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResetChecklistDto, UpdateResetChecklistDto } from './dto/reset-checklist.dto';

@Injectable()
export class ResetChecklistService {
  constructor(private prisma: PrismaService) {}

  async list(escapeVenueId: string, params: { page?: number; status?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { escapeVenueId };
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.resetChecklist.findMany({
        where,
        orderBy: { scheduledAt: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.resetChecklist.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(escapeVenueId: string, id: string) {
    const maintenance = await this.prisma.resetChecklist.findFirst({
      where: { id, escapeVenueId },
    });
    if (!maintenance) throw new NotFoundException('Kort bakım kaydı bulunamadı');
    return maintenance;
  }

  async create(escapeVenueId: string, dto: CreateResetChecklistDto) {
    return this.prisma.resetChecklist.create({
      data: {
        ...dto,
        escapeVenueId,
        scheduledAt: new Date(dto.scheduledAt),
      },
    });
  }

  async update(escapeVenueId: string, id: string, dto: UpdateResetChecklistDto) {
    await this.get(escapeVenueId, id);
    const data = { ...dto };
    if (dto.scheduledAt) {
      (data as { scheduledAt?: Date }).scheduledAt = new Date(dto.scheduledAt);
    }
    return this.prisma.resetChecklist.update({ where: { id }, data });
  }

  async remove(escapeVenueId: string, id: string) {
    await this.get(escapeVenueId, id);
    return this.prisma.resetChecklist.delete({ where: { id } });
  }
}
