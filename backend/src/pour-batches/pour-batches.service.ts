import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePourBatchDto, UpdatePourBatchDto } from './dto/pour-batch.dto';

@Injectable()
export class PourBatchesService {
  constructor(private prisma: PrismaService) {}

  async list(resinStudioId: string, params: { page?: number; status?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { resinStudioId };
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.pourBatch.findMany({
        where,
        orderBy: { scheduledAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          workstation: { select: { id: true, name: true, zone: true, workstationType: true } },
        },
      }),
      this.prisma.pourBatch.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(resinStudioId: string, id: string) {
    const session = await this.prisma.pourBatch.findFirst({
      where: { id, resinStudioId },
      include: { workstation: true },
    });
    if (!session) throw new NotFoundException('Ders oturumu bulunamadı');
    return session;
  }

  async create(resinStudioId: string, dto: CreatePourBatchDto) {
    return this.prisma.pourBatch.create({
      data: {
        ...dto,
        resinStudioId,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : new Date(),
      },
      include: { workstation: true },
    });
  }

  async update(resinStudioId: string, id: string, dto: UpdatePourBatchDto) {
    await this.get(resinStudioId, id);
    const data = { ...dto };
    if (dto.scheduledAt) {
      (data as { scheduledAt?: Date }).scheduledAt = new Date(dto.scheduledAt);
    }
    return this.prisma.pourBatch.update({
      where: { id },
      data,
      include: { workstation: true },
    });
  }

  async remove(resinStudioId: string, id: string) {
    await this.get(resinStudioId, id);
    return this.prisma.pourBatch.delete({ where: { id } });
  }
}
