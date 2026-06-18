import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkshopRateDto, UpdateWorkshopRateDto } from './dto/workshop-rate.dto';

@Injectable()
export class WorkshopRatesService {
  constructor(private prisma: PrismaService) {}

  async list(resinStudioId: string, params: { page?: number; status?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { resinStudioId };
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.workshopRate.findMany({
        where,
        orderBy: { rateCategory: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.workshopRate.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(resinStudioId: string, id: string) {
    const tier = await this.prisma.workshopRate.findFirst({
      where: { id, resinStudioId },
    });
    if (!tier) throw new NotFoundException('Atölye Ücreti bulunamadı');
    return tier;
  }

  async create(resinStudioId: string, dto: CreateWorkshopRateDto) {
    return this.prisma.workshopRate.create({ data: { ...dto, resinStudioId } });
  }

  async update(resinStudioId: string, id: string, dto: UpdateWorkshopRateDto) {
    await this.get(resinStudioId, id);
    return this.prisma.workshopRate.update({ where: { id }, data: dto });
  }

  async remove(resinStudioId: string, id: string) {
    await this.get(resinStudioId, id);
    return this.prisma.workshopRate.delete({ where: { id } });
  }
}
