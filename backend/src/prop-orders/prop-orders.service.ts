import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePropOrderDto, UpdatePropOrderDto } from './dto/prop-order.dto';

@Injectable()
export class PropOrdersService {
  constructor(private prisma: PrismaService) {}

  async list(
    escapeVenueId: string,
    params: { page?: number; status?: string; propCategory?: string },
  ) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { escapeVenueId };
    if (params.status) where.status = params.status;
    if (params.propCategory) where.propCategory = params.propCategory;

    const [data, total] = await Promise.all([
      this.prisma.propOrder.findMany({
        where,
        orderBy: [{ status: 'asc' }, { customerName: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.propOrder.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async pending(escapeVenueId: string) {
    return this.prisma.propOrder.findMany({
      where: { escapeVenueId, status: { in: ['pending', 'in_progress'] } },
      orderBy: { createdAt: 'asc' },
      take: 10,
    });
  }

  async get(escapeVenueId: string, id: string) {
    const order = await this.prisma.propOrder.findFirst({
      where: { id, escapeVenueId },
    });
    if (!order) throw new NotFoundException('Tel gerdirme siparişi bulunamadı');
    return order;
  }

  async create(escapeVenueId: string, dto: CreatePropOrderDto) {
    return this.prisma.propOrder.create({ data: { ...dto, escapeVenueId } });
  }

  async update(escapeVenueId: string, id: string, dto: UpdatePropOrderDto) {
    await this.get(escapeVenueId, id);
    return this.prisma.propOrder.update({ where: { id }, data: dto });
  }

  async remove(escapeVenueId: string, id: string) {
    await this.get(escapeVenueId, id);
    return this.prisma.propOrder.delete({ where: { id } });
  }
}
