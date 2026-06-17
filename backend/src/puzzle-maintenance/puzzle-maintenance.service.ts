import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePuzzleMaintenanceDto,
  UpdatePuzzleMaintenanceDto,
} from './dto/puzzle-maintenance.dto';

@Injectable()
export class PuzzleMaintenanceService {
  constructor(private prisma: PrismaService) {}

  async list(
    escapeVenueId: string,
    params: { page?: number; status?: string; priority?: string },
  ) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { escapeVenueId };
    if (params.status) where.status = params.status;
    if (params.priority) where.priority = params.priority;

    const [data, total] = await Promise.all([
      this.prisma.puzzleMaintenance.findMany({
        where,
        orderBy: { reportedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          escapeRoom: { select: { id: true, name: true, wing: true } },
        },
      }),
      this.prisma.puzzleMaintenance.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async urgent(escapeVenueId: string) {
    return this.prisma.puzzleMaintenance.findMany({
      where: {
        escapeVenueId,
        status: { in: ['open', 'in_progress'] },
        priority: { in: ['high', 'urgent'] },
      },
      include: { escapeRoom: { select: { name: true, wing: true } } },
      orderBy: { reportedAt: 'desc' },
      take: 10,
    });
  }

  async get(escapeVenueId: string, id: string) {
    const maintenance = await this.prisma.puzzleMaintenance.findFirst({
      where: { id, escapeVenueId },
      include: { escapeRoom: true },
    });
    if (!maintenance) throw new NotFoundException('Top makinesi bakım kaydı bulunamadı');
    return maintenance;
  }

  async create(escapeVenueId: string, dto: CreatePuzzleMaintenanceDto) {
    return this.prisma.puzzleMaintenance.create({
      data: {
        ...dto,
        escapeVenueId,
        reportedAt: dto.reportedAt ? new Date(dto.reportedAt) : new Date(),
      },
      include: { escapeRoom: true },
    });
  }

  async update(escapeVenueId: string, id: string, dto: UpdatePuzzleMaintenanceDto) {
    await this.get(escapeVenueId, id);
    const data = { ...dto };
    if (dto.reportedAt) {
      (data as { reportedAt?: Date }).reportedAt = new Date(dto.reportedAt);
    }
    if (dto.completedAt) {
      (data as { completedAt?: Date }).completedAt = new Date(dto.completedAt);
    }
    return this.prisma.puzzleMaintenance.update({
      where: { id },
      data,
      include: { escapeRoom: true },
    });
  }

  async remove(escapeVenueId: string, id: string) {
    await this.get(escapeVenueId, id);
    return this.prisma.puzzleMaintenance.delete({ where: { id } });
  }
}
