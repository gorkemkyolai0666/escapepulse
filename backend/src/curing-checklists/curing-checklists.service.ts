import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCuringChecklistDto, UpdateCuringChecklistDto } from './dto/curing-checklist.dto';

@Injectable()
export class CuringChecklistService {
  constructor(private prisma: PrismaService) {}

  async list(resinStudioId: string, params: { page?: number; status?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { resinStudioId };
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.curingChecklist.findMany({
        where,
        orderBy: { scheduledAt: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.curingChecklist.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(resinStudioId: string, id: string) {
    const maintenance = await this.prisma.curingChecklist.findFirst({
      where: { id, resinStudioId },
    });
    if (!maintenance) throw new NotFoundException('Kort bakım kaydı bulunamadı');
    return maintenance;
  }

  async create(resinStudioId: string, dto: CreateCuringChecklistDto) {
    return this.prisma.curingChecklist.create({
      data: {
        ...dto,
        resinStudioId,
        scheduledAt: new Date(dto.scheduledAt),
      },
    });
  }

  async update(resinStudioId: string, id: string, dto: UpdateCuringChecklistDto) {
    await this.get(resinStudioId, id);
    const data = { ...dto };
    if (dto.scheduledAt) {
      (data as { scheduledAt?: Date }).scheduledAt = new Date(dto.scheduledAt);
    }
    return this.prisma.curingChecklist.update({ where: { id }, data });
  }

  async remove(resinStudioId: string, id: string) {
    await this.get(resinStudioId, id);
    return this.prisma.curingChecklist.delete({ where: { id } });
  }
}
