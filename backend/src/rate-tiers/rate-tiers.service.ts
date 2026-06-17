import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRateTierDto, UpdateRateTierDto } from './dto/rate-tier.dto';

@Injectable()
export class RateTiersService {
  constructor(private prisma: PrismaService) {}

  async list(escapeVenueId: string, params: { page?: number; status?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { escapeVenueId };
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.rateTier.findMany({
        where,
        orderBy: { rateCategory: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.rateTier.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(escapeVenueId: string, id: string) {
    const tier = await this.prisma.rateTier.findFirst({
      where: { id, escapeVenueId },
    });
    if (!tier) throw new NotFoundException('Tarife bulunamadı');
    return tier;
  }

  async create(escapeVenueId: string, dto: CreateRateTierDto) {
    return this.prisma.rateTier.create({ data: { ...dto, escapeVenueId } });
  }

  async update(escapeVenueId: string, id: string, dto: UpdateRateTierDto) {
    await this.get(escapeVenueId, id);
    return this.prisma.rateTier.update({ where: { id }, data: dto });
  }

  async remove(escapeVenueId: string, id: string) {
    await this.get(escapeVenueId, id);
    return this.prisma.rateTier.delete({ where: { id } });
  }
}
