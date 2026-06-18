import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMoldOrderDto, UpdateMoldOrderDto } from './dto/mold-order.dto';

@Injectable()
export class MoldOrdersService {
  constructor(private prisma: PrismaService) {}

  async list(
    resinStudioId: string,
    params: { page?: number; status?: string; moldType?: string },
  ) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { resinStudioId };
    if (params.status) where.status = params.status;
    if (params.moldType) where.moldType = params.moldType;

    const [data, total] = await Promise.all([
      this.prisma.moldOrder.findMany({
        where,
        orderBy: [{ status: 'asc' }, { customerName: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.moldOrder.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async pending(resinStudioId: string) {
    return this.prisma.moldOrder.findMany({
      where: { resinStudioId, status: { in: ['pending', 'in_progress'] } },
      orderBy: { createdAt: 'asc' },
      take: 10,
    });
  }

  async get(resinStudioId: string, id: string) {
    const order = await this.prisma.moldOrder.findFirst({
      where: { id, resinStudioId },
    });
    if (!order) throw new NotFoundException('Tel gerdirme siparişi bulunamadı');
    return order;
  }

  async create(resinStudioId: string, dto: CreateMoldOrderDto) {
    return this.prisma.moldOrder.create({ data: { ...dto, resinStudioId } });
  }

  async update(resinStudioId: string, id: string, dto: UpdateMoldOrderDto) {
    await this.get(resinStudioId, id);
    return this.prisma.moldOrder.update({ where: { id }, data: dto });
  }

  async remove(resinStudioId: string, id: string) {
    await this.get(resinStudioId, id);
    return this.prisma.moldOrder.delete({ where: { id } });
  }
}
